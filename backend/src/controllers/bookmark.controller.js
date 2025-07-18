import { Bookmark } from '../models/bookmark.model.js';

// Create a new bookmark
export async function createBookmark(req, res) {
  try {
    const bookmark = new Bookmark({ ...req.body, userId: req.user.userId });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all bookmarks (with optional search and tag filtering)
export async function getBookmarks(req, res) {
  try {
    const { q, tags } = req.query;
    let filter = { userId: req.user.userId };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { url: { $regex: q, $options: 'i' } }
      ];
    }
    if (tags) {
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagArr.length) filter.tags = { $all: tagArr };
    }
    const bookmarks = await Bookmark.find(filter).sort({ updatedAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a single bookmark by ID
export async function getBookmarkById(req, res) {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark || String(bookmark.userId) !== String(req.user.userId)) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update a bookmark by ID
export async function updateBookmark(req, res) {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark || String(bookmark.userId) !== String(req.user.userId)) return res.status(404).json({ error: 'Bookmark not found' });
    Object.assign(bookmark, req.body);
    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a bookmark by ID
export async function deleteBookmark(req, res) {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark || String(bookmark.userId) !== String(req.user.userId)) return res.status(404).json({ error: 'Bookmark not found' });
    await bookmark.deleteOne();
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function toggleFavoriteBookmark(req, res) {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark || String(bookmark.userId) !== String(req.user.userId)) return res.status(404).json({ error: 'Bookmark not found' });
    bookmark.favorite = !bookmark.favorite;
    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} 