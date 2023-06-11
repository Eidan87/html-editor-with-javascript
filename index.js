const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Conservar el nombre y la extensión original del archivo
  }
});

const upload = multer({ storage });

app.use(express.static('public'));

app.get('/uploads', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al leer los archivos');
    }

    res.send(files);
  });
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.sendFile(filePath);
});

app.get('/editor', (req, res) => {
  res.sendFile(path.join(__dirname, 'editor.html'));
});

app.post('/upload', upload.array('files'), (req, res) => {
  // Los archivos se encuentran en req.files
  // Puedes procesarlos o moverlos a otra carpeta aquí

  res.send('Archivos subidos exitosamente');
});

app.post('/create-folder', express.json(), (req, res) => {
  const folderName = req.body.folderName;
  const folderPath = path.join(__dirname, 'uploads', folderName);

  fs.mkdir(folderPath, (err) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: 'Error al crear la carpeta' });
    }

    res.json({ success: true });
  });
});

app.delete('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: 'Error al eliminar el archivo' });
    }

    res.json({ success: true });
  });
});


app.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000');
});
