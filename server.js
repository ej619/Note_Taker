const express = require('express');
const fs = require('fs');
const path = require('path');

// Server setup
const PORT = process.env.PORT || 8000;
const app = express();

// Static middleware
app.use(express.static(path.join(__dirname, 'Develop', 'public')));
app.use(express.json()); // Parse JSON request body

// Get Request
app.get('/api/notes', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8');
  const notes = JSON.parse(data);
  res.json(notes);
});

// POST Request
app.post('/api/notes', (req, res) => {
  const note = req.body;
  const data = fs.readFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8');
  const notes = JSON.parse(data);
  note.id = notes.length + 1;
  notes.push(note);
  fs.writeFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes));
  res.json(note);
});

// DELETE Request
app.delete('/api/notes/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  const data = fs.readFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8');
  let notes = JSON.parse(data);
  notes = notes.filter(note => note.id !== idToDelete);
  fs.writeFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes));
  res.send('Note deleted!');
});

// HTML
app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
