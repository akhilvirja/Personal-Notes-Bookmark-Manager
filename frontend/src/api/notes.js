// Simple in-memory mock data
let notes = [
  {
    id: '1',
    title: 'Sample Note',
    content: 'This is a sample note.',
    tags: ['sample', 'test'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getNotes({ q = '', tags = [] } = {}) {
  let filtered = notes;
  if (q) {
    filtered = filtered.filter(
      n => n.title.toLowerCase().includes(q.toLowerCase()) ||
           n.content.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (tags.length) {
    filtered = filtered.filter(n => tags.every(tag => n.tags.includes(tag)));
  }
  return Promise.resolve(filtered);
}

export function getNoteById(id) {
  const note = notes.find(n => n.id === id);
  return Promise.resolve(note);
}

export function addNote(note) {
  const newNote = {
    ...note,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  return Promise.resolve(newNote);
}

export function updateNote(id, updates) {
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return Promise.resolve(null);
  notes[idx] = { ...notes[idx], ...updates, updatedAt: new Date().toISOString() };
  return Promise.resolve(notes[idx]);
}

export function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  return Promise.resolve(true);
} 