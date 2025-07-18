import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      const data = res.data;
      if (!res.status || res.status >= 400) throw new Error(data.error || 'Registration failed');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-2 md:p-8">
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700 text-center">Create your account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700 text-base md:text-lg">Username
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
            />
          </label>
          <label className="font-semibold text-gray-700 text-base md:text-lg">Email
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
            />
          </label>
          <label className="font-semibold text-gray-700 text-base md:text-lg">Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold py-2 rounded mt-2 hover:bg-blue-700 transition disabled:opacity-50 text-base md:text-lg"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && (
            <div className="text-red-600 text-center" role="alert">
              {error}
            </div>
          )}
        </form>
        <div className="mt-6 text-center text-gray-600 text-base md:text-lg">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 hover:underline font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
