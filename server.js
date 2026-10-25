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

// Endpoint para recibir y guardar todos los recursos
app.post('/api/compile', (req, res) => {
  try {
    const publicPath = path.join(__dirname, 'public');

    // 1. Guardar mapa de puntos (.mind)
    if (req.files && req.files.mindFile) {
      fs.writeFileSync(path.join(publicPath, 'targets.mind'), req.files.mindFile.data);
    }

    // 2. Guardar silueta guía (2.png)
    if (req.files && req.files.fotoSilueta) {
      fs.writeFileSync(path.join(publicPath, '2.png'), req.files.fotoSilueta.data);
    }

    // 3. Guardar Video Animación (intro.mp4)
    if (req.files && req.files.videoFile) {
      fs.writeFileSync(path.join(publicPath, 'intro.mp4'), req.files.videoFile.data);
    }

    // 4. Guardar Canción / Audio (audio.mp3)
    if (req.files && req.files.audioFile) {
      fs.writeFileSync(path.join(publicPath, 'audio.mp3'), req.files.audioFile.data);
    }

    res.json({ success: true, message: 'Todos los recursos fueron guardados exitosamente en Render.' });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor WebAR corriendo exitosamente en el puerto ${PORT}`);
});
