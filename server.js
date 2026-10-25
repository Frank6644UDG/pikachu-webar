const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(express.json());

// Endpoint API para recibir y guardar archivos
app.post('/api/compile', async (req, res) => {
  try {
    if (req.files && req.files.fotoSilueta) {
      const siluetaPath = path.join(__dirname, 'public', '2.png');
      fs.writeFileSync(siluetaPath, req.files.fotoSilueta.data);
    }

    if (req.files && req.files.fotoObjetivo) {
      const { Compiler } = require('mind-ar/dist/mindar-image.prod.js');
      const compiler = new Compiler();
      await compiler.compileImageTargets([req.files.fotoObjetivo.data]);
      const exportedBuffer = await compiler.exportData();

      const targetPath = path.join(__dirname, 'public', 'targets.mind');
      fs.writeFileSync(targetPath, exportedBuffer);
    }

    res.json({ success: true, message: 'Archivos procesados correctamente.' });
  } catch (error) {
    console.error('Error al procesar en servidor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor WebAR escuchando en el puerto ${PORT}`);
});
