import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function Spinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
  );
}

function Star({ filled, onClick, label, size = 20 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`focus:outline-none ${filled ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500 transition`}
      style={{ fontSize: size }}
    >
      {filled ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="inline w-5 h-5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      )}
    </button>
  );
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [adding, setAdding] = useState(false);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editing, setEditing] = useState(false);

  // Search/filter state
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [filtering, setFiltering] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  // Helper to add auth header
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch bookmarks (with optional search/filter)
  const fetchBookmarks = async (opts = {}) => {
    setLoading(true);
    try {
      let urlStr = '/api/bookmarks';
      const params = [];
      if (opts.q) params.push(`q=${encodeURIComponent(opts.q)}`);
      if (opts.tags && opts.tags.length) params.push(`tags=${opts.tags.join(',')}`);
      if (params.length) urlStr += `?${params.join('&')}`;
      const res = await axios.get(urlStr, { headers: { ...authHeader } });
      setBookmarks(res.data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 401) return navigate('/login');
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchBookmarks();
    // eslint-disable-next-line
  }, [token]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post('/api/bookmarks', {
        url,
        title,
        description,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }, { headers: { ...authHeader } });
      setBookmarks(prev => [...prev, res.data]);
      setUrl('');
      setTitle('');
      setDescription('');
      setTags('');
      setSuccess('Bookmark added!');
    } catch (err) {
      if (err.response && err.response.status === 401) return navigate('/login');
      setError('Failed to add bookmark');
    } finally {
      setAdding(false);
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  const startEdit = (bookmark) => {
    setEditId(bookmark.id || bookmark._id);
    setEditUrl(bookmark.url);
    setEditTitle(bookmark.title);
    setEditDescription(bookmark.description);
    setEditTags(bookmark.tags.join(', '));
  };

  const handleEditBookmark = async (e) => {
    e.preventDefault();
    setEditing(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.put(`/api/bookmarks/${editId}`, {
        url: editUrl,
        title: editTitle,
        description: editDescription,
        tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      }, { headers: { ...authHeader } });
      setBookmarks(prev => prev.map(b => (b.id || b._id) === editId ? res.data : b));
      setEditId(null);
      setEditUrl('');
      setEditTitle('');
      setEditDescription('');
      setEditTags('');
      setSuccess('Bookmark updated!');
    } catch (err) {
      if (err.response && err.response.status === 401) return navigate('/login');
      setError('Failed to update bookmark');
    } finally {
      setEditing(false);
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  const handleDeleteBookmark = async (id) => {
    if (!window.confirm('Delete this bookmark?')) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/api/bookmarks/${id}`, { headers: { ...authHeader } });
      setBookmarks(prev => prev.filter(b => (b.id || b._id) !== id));
      setSuccess('Bookmark deleted!');
    } catch (err) {
      if (err.response && err.response.status === 401) return navigate('/login');
      setError('Failed to delete bookmark');
    } finally {
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  // Add favorite toggle handler
  const handleToggleFavorite = async (id) => {
    try {
      const res = await axios.patch(`/api/bookmarks/${id}/favorite`, {}, { headers: { ...authHeader } });
      setBookmarks(prev => prev.map(b => (b.id || b._id) === id ? res.data : b));
    } catch (err) {
      // Optionally show error
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    setFiltering(true);
    await fetchBookmarks({
      q: search,
      tags: filterTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setFiltering(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Bookmarks</h2>
        <div className="border-b border-gray-200 mb-6" />
        <div className="flex items-center gap-2 mb-4">
          <input
            id="show-favorites"
            type="checkbox"
            checked={showFavorites}
            onChange={e => setShowFavorites(e.target.checked)}
            className="accent-yellow-400 w-4 h-4"
          />
          <label htmlFor="show-favorites" className="text-sm md:text-base text-gray-700 cursor-pointer select-none">
            Show only favorites
          </label>
        </div>
        {/* Search and tag filter */}
        <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-2 mb-6" aria-label="Filter bookmarks">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1 flex-1 min-w-0"
            aria-label="Search bookmarks"
          />
          <input
            type="text"
            placeholder="Filter by tags (comma separated)"
            value={filterTags}
            onChange={e => setFilterTags(e.target.value)}
            className="border rounded px-2 py-1 flex-1 min-w-0"
            aria-label="Filter by tags"
          />
          <button type="submit" disabled={filtering} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded disabled:opacity-50 w-full md:w-auto transition">
            {filtering ? 'Filtering...' : 'Filter'}
          </button>
        </form>
        {/* Add bookmark form */}
        <form onSubmit={handleAddBookmark} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 flex flex-col md:flex-row md:items-end gap-2 md:gap-4" aria-label="Add bookmark">
          <label className="font-semibold flex-1">URL
            <input
              type="url"
              placeholder="URL"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </label>
          <label className="font-semibold flex-1">Title
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </label>
          <label className="font-semibold flex-1">Description
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </label>
          <label className="font-semibold flex-1">Tags
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </label>
          <button type="submit" disabled={adding} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2 md:mt-0 disabled:opacity-50 w-full md:w-auto transition">{adding ? 'Adding...' : 'Add Bookmark'}</button>
        </form>
        {error && <div className="text-red-600 mb-2" role="alert">{error}</div>}
        {success && <div className="text-green-600 mb-2" role="status">{success}</div>}
        {loading ? (
          <Spinner />
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center text-gray-500 mt-8">
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" /></svg>
            <span>No bookmarks found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showFavorites ? bookmarks.filter(b => b.favorite) : bookmarks).map(bookmark => (
              <div key={bookmark.id || bookmark._id} className="relative bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col min-h-[180px] group transition hover:shadow-lg">
                <button
                  className="absolute top-3 right-3 z-10 p-0 bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent"
                  onClick={() => handleToggleFavorite(bookmark.id || bookmark._id)}
                  aria-label={bookmark.favorite ? 'Unmark as favorite' : 'Mark as favorite'}
                >
                  <Star filled={bookmark.favorite} size={20} />
                </button>
                {editId === (bookmark.id || bookmark._id) ? (
                  <form onSubmit={handleEditBookmark} className="flex flex-col gap-2 flex-1" aria-label="Edit bookmark">
                    <input
                      type="url"
                      value={editUrl}
                      onChange={e => setEditUrl(e.target.value)}
                      required
                      className="border rounded px-2 py-1 flex-1 min-w-0"
                      aria-label="Edit url"
                    />
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="border rounded px-2 py-1 flex-1 min-w-0"
                      aria-label="Edit title"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="border rounded px-2 py-1 flex-1 min-w-0"
                      aria-label="Edit description"
                    />
                    <input
                      type="text"
                      value={editTags}
                      onChange={e => setEditTags(e.target.value)}
                      className="border rounded px-2 py-1 flex-1 min-w-0"
                      aria-label="Edit tags"
                    />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" disabled={editing} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50">
                        {editing ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setEditId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl font-semibold text-blue-700 hover:underline">
                        {bookmark.title || bookmark.url}
                      </a>
                    </div>
                    <div className="text-gray-700 mb-2 flex-1">{bookmark.description}</div>
                    <div className="text-xs text-gray-500 mt-auto">Tags: {bookmark.tags.join(', ')}</div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => startEdit(bookmark)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteBookmark(bookmark.id || bookmark._id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 