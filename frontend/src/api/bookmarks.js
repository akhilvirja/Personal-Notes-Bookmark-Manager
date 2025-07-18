// Simple in-memory mock data
let bookmarks = [
  {
    id: '1',
    url: 'https://example.com',
    title: 'Example',
    description: 'Sample bookmark',
    tags: ['sample', 'test'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getBookmarks({ q = '', tags = [] } = {}) {
  let filtered = bookmarks;
  if (q) {
    filtered = filtered.filter(
      b => b.title.toLowerCase().includes(q.toLowerCase()) ||
           b.description.toLowerCase().includes(q.toLowerCase()) ||
           b.url.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (tags.length) {
    filtered = filtered.filter(b => tags.every(tag => b.tags.includes(tag)));
  }
  return Promise.resolve(filtered);
}

export function getBookmarkById(id) {
  const bookmark = bookmarks.find(b => b.id === id);
  return Promise.resolve(bookmark);
}

export function addBookmark(bookmark) {
  const newBookmark = {
    ...bookmark,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  bookmarks.push(newBookmark);
  return Promise.resolve(newBookmark);
}

export function updateBookmark(id, updates) {
  const idx = bookmarks.findIndex(b => b.id === id);
  if (idx === -1) return Promise.resolve(null);
  bookmarks[idx] = { ...bookmarks[idx], ...updates, updatedAt: new Date().toISOString() };
  return Promise.resolve(bookmarks[idx]);
}

export function deleteBookmark(id) {
  bookmarks = bookmarks.filter(b => b.id !== id);
  return Promise.resolve(true);
} 