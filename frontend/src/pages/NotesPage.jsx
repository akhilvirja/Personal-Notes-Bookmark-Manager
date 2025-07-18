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

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [adding, setAdding] = useState(false);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
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

  // Fetch notes (with optional search/filter)
  const fetchNotes = async (opts = {}) => {
    setLoading(true);
    try {
      let url = '/api/notes';
      const params = [];
      if (opts.q) params.push(`q=${encodeURIComponent(opts.q)}`);
      if (opts.tags && opts.tags.length) params.push(`tags=${opts.tags.join(',')}`);
      if (params.length) url += `?${params.join('&')}`;
      const res = await axios.get(url, { headers: { ...authHeader } });
      setNotes(res.data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 401) return navigate('/login');
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchNotes();
    // eslint-disable-next-line
  }, [token]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post('/api/notes', {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }, { headers: { ...authHeader } });
      setNotes(prev => [...prev, res.data]);
      setTitle('');
      setContent('');
      setTags('');
      setSuccess('Note added!');
    } catch (err) {
      if (err.response && err.response.status === 401) return navigate('/login');
      setError('Failed to add note');
    } finally {
      setAdding(false);
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  const startEdit = (note) => {
    setEditId(note.id || note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
  };

  const handleEditNote = async (e) => {
    e.preventDefault();
    setEditing(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.put(`/api/notes/${editId}`, {
        title: editTitle,
        content: editContent,
        tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      }, { headers: { ...authHeader } });
      setNotes(prev => prev.map(n => (n.id || n._id) === editId ? res.data : n));
      setEditId(null);
      setEditTitle('');
      setEditContent('');
      setEditTags('');
      setSuccess('Note updated!');
    } catch (err) {
      if (err.response && err.response.status === 401) return navigate('/login');
      setError('Failed to update note');
    } finally {
      setEditing(false);
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/api/notes/${id}`, { headers: { ...authHeader } });
      setNotes(prev => prev.filter(n => (n.id || n._id) !== id));
      setSuccess('Note deleted!');
    } catch (err) {
      if (err.response && err.response.status === 401) return navigate('/login');
      setError('Failed to delete note');
    } finally {
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  // Add favorite toggle handler
  const handleToggleFavorite = async (id) => {
    try {
      const res = await axios.patch(`/api/notes/${id}/favorite`, {}, { headers: { ...authHeader } });
      setNotes(prev => prev.map(n => (n.id || n._id) === id ? res.data : n));
    } catch (err) {
      // Optionally show error
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    setFiltering(true);
    await fetchNotes({
      q: search,
      tags: filterTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setFiltering(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Notes</h2>
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
        <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-2 mb-6" aria-label="Filter notes">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1 flex-1 min-w-0"
            aria-label="Search notes"
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
        {/* Add note form */}
        <form onSubmit={handleAddNote} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 flex flex-col md:flex-row md:items-end gap-2 md:gap-4" aria-label="Add note">
          <label className="font-semibold flex-1">
            Title
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </label>
          <label className="font-semibold flex-1">
            Content
            <input
              type="text"
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </label>
          <label className="font-semibold flex-1">
            Tags
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </label>
          <button type="submit" disabled={adding} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2 md:mt-0 disabled:opacity-50 w-full md:w-auto transition">{adding ? 'Adding...' : 'Add Note'}</button>
        </form>
        {error && <div className="text-red-600 mb-2" role="alert">{error}</div>}
        {success && <div className="text-green-600 mb-2" role="status">{success}</div>}
        {loading ? (
          <Spinner />
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center text-gray-500 mt-8">
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" /></svg>
            <span>No notes found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showFavorites ? notes.filter(n => n.favorite) : notes).map(note => (
              <div key={note.id || note._id} className="relative bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col min-h-[180px] group transition hover:shadow-lg">
                <button
                  className="absolute top-3 right-3 z-10 p-0 bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent"
                  onClick={() => handleToggleFavorite(note.id || note._id)}
                  aria-label={note.favorite ? 'Unmark as favorite' : 'Mark as favorite'}
                >
                  <Star filled={note.favorite} size={20} />
                </button>
                {editId === (note.id || note._id) ? (
                  <form onSubmit={handleEditNote} className="flex flex-col gap-2 flex-1" aria-label="Edit note">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      required
                      className="border rounded px-2 py-1 flex-1 min-w-0"
                      aria-label="Edit title"
                    />
                    <input
                      type="text"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      required
                      className="border rounded px-2 py-1 flex-1 min-w-0"
                      aria-label="Edit content"
                    />
                    <input
                      type="text"
                      value={editTags}
                      onChange={e => setEditTags(e.target.value)}
                      className="border rounded px-2 py-1 flex-1 min-w-0"
                      aria-label="Edit tags"
                    />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" disabled={editing} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50 transition">
                        {editing ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setEditId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <strong className="text-lg md:text-xl text-gray-900">{note.title}</strong>
                    </div>
                    <div className="text-gray-700 mb-2 flex-1">{note.content}</div>
                    <div className="text-xs text-gray-500 mt-auto">Tags: {note.tags.join(', ')}</div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => startEdit(note)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteNote(note.id || note._id)} className="text-red-600 hover:underline">Delete</button>
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