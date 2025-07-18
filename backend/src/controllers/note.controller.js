import { Note } from '../models/note.model.js';

// Create a new note
export async function createNote(req, res) {
  try {
    const note = new Note({ ...req.body, userId: req.user.userId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all notes (with optional search and tag filtering)
export async function getNotes(req, res) {
  try {
    const { q, tags } = req.query;
    let filter = { userId: req.user.userId };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }
    if (tags) {
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagArr.length) filter.tags = { $all: tagArr };
    }
    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a single note by ID
export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || String(note.userId) !== String(req.user.userId)) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update a note by ID
export async function updateNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || String(note.userId) !== String(req.user.userId)) return res.status(404).json({ error: 'Note not found' });
    Object.assign(note, req.body);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a note by ID
export async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || String(note.userId) !== String(req.user.userId)) return res.status(404).json({ error: 'Note not found' });
    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function toggleFavoriteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || String(note.userId) !== String(req.user.userId)) return res.status(404).json({ error: 'Note not found' });
    note.favorite = !note.favorite;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} 