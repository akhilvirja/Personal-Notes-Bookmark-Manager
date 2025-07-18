import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './AuthContext';

function Navbar() {
  const { token, logout, user } = useAuth();
  const location = useLocation();

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-md transition font-medium ${
      location.pathname === path
        ? 'text-blue-700 bg-blue-100'
        : 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/notes"
            className="text-2xl font-bold text-gray-800 hover:text-blue-700"
          >
            Bookmark Manager
          </Link>
          <div className="hidden md:flex gap-4">
            <Link to="/notes" className={navLinkClass('/notes')}>
              Notes
            </Link>
            <Link to="/bookmarks" className={navLinkClass('/bookmarks')}>
              Bookmarks
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 md:mt-0">
          {token ? (
            <>
              {user && (
                <span className="text-sm text-gray-600 font-medium hidden sm:block">
                  {user.username || user.email}
                </span>
              )}
              <button
                onClick={logout}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
          <Routes>
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
