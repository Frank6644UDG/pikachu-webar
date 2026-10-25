const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Servir los archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(express.json());

// Endpoint para recibir y guardar los archivos compilados
app.post('/api/compile', (req, res) => {
  try {
    // Guardar silueta 2.png
    if (req.files && req.files.fotoSilueta) {
      const siluetaPath = path.join(__dirname, 'public', '2.png');
      fs.writeFileSync(siluetaPath, req.files.fotoSilueta.data);
    }

    // Guardar archivo targets.mind compilado
    if (req.files && req.files.mindFile) {
      const targetPath = path.join(__dirname, 'public', 'targets.mind');
      fs.writeFileSync(targetPath, req.files.mindFile.data);
    }

    res.json({ success: true, message: 'Archivos actualizados correctamente en el servidor.' });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor WebAR corriendo exitosamente en el puerto ${PORT}`);
});
