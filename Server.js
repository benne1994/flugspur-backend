const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use(cors());
app.use(express.static(uploadFolder));

app.get('/list', (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Lesen' });
    res.json(files.filter(f => f.endsWith('.kml')));
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('Keine Datei hochgeladen');
  res.send('Datei erfolgreich gespeichert');
});

app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
