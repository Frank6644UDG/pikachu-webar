const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { Compiler } = require('mind-ar/dist/mindar-image.prod.js'); // Motor MindAR Node

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos (admin.html, index.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(express.json());

// RUTA API: Compilar imagen subida a .mind dinámicamente
app.post('/api/compile', async (req, res) => {
  try {
    if (!req.files || !req.files.fotoObjetivo) {
      return res.status(400).send('No se recibió la foto objetivo.');
    }

    const fotoBuffer = req.files.fotoObjetivo.data;
    
    // 1. Instanciar el compilador de MindAR
    const compiler = new Compiler();
    
    // 2. Procesar la imagen recibida
    await compiler.compileImageTargets([fotoBuffer]);
    const exportedBuffer = await compiler.exportData();

    // 3. Guardar el mapa de puntos generado en la carpeta pública
    const targetPath = path.join(__dirname, 'public', 'targets.mind');
    fs.writeFileSync(targetPath, exportedBuffer);

    // 4. Si también subieron silueta PNG, guardarla como 2.png
    if (req.files.fotoSilueta) {
      const siluetaPath = path.join(__dirname, 'public', '2.png');
      fs.writeFileSync(siluetaPath, req.files.fotoSilueta.data);
    }

    res.json({ success: true, message: 'Compilación completada con éxito.' });
  } catch (error) {
    console.error('Error al compilar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor WebAR corriendo en puerto ${PORT}`);
});
