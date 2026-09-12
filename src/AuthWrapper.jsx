import React, { useState, useEffect } from 'react';
import App from './App.jsx';

export default function AuthWrapper() {
  const [token, setToken] = useState(() => localStorage.getItem('ascend_token'));
  const [authUsername, setAuthUsername] = useState(() => localStorage.getItem('ascend_username'));

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (t, u) => {
    localStorage.setItem('ascend_token', t);
    localStorage.setItem('ascend_username', u);
    setToken(t);
    setAuthUsername(u);
  };

  const handleLogout = () => {
    localStorage.removeItem('ascend_token');
    localStorage.removeItem('ascend_username');
    setToken(null);
    setAuthUsername(null);
    window.location.reload();
  };

  // Expose logout to window so App.jsx can call it if needed
  useEffect(() => {
    window.ascendLogout = handleLogout;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(apiUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      
      handleLogin(data.token, data.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return <App />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 max-w-md w-full p-8 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] mb-4" />
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">ASCEND</h1>
          <p className="text-slate-400 text-sm mt-2 font-mono">Authenticate to Continue</p>
        </div>

        {error && <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm font-mono text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500/50 transition font-mono"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500/50 transition font-mono"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {loading ? 'Processing...' : (isLogin ? 'Enter System' : 'Create Record')}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          {isLogin ? "No record found? " : "Already registered? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:text-cyan-300 font-bold transition">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
