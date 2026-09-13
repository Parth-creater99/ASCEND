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

  useEffect(() => {
    window.ascendLogout = handleLogout;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(apiUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'AUTH_REJECTED: Authentication failed');
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712] font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Immersive Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        
        {/* subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>
      
      <div className="relative z-10 w-full max-w-[420px] mx-4 p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
        <div className="w-full h-full p-10 bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-2xl">
          
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/30 transition duration-700" />
              <img src="/logo.jpg" alt="Ascend OS Logo" className="relative w-20 h-20 rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]" />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-[0.2em] uppercase">ASCEND</h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <p className="text-cyan-500/70 text-xs font-mono tracking-widest uppercase">System Offline // Local Auth</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-rose-400 text-sm font-mono leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="commander"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider ml-1">Security Key</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-4 w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-black bg-white hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all disabled:opacity-50 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span className="uppercase tracking-widest">{isLogin ? 'Initiate Link' : 'Register Identity'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
            <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
              {isLogin ? "Unidentified User?" : "Known Entity?"}
            </p>
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-cyan-400 hover:text-cyan-300 font-bold transition text-sm uppercase tracking-widest"
            >
              {isLogin ? 'Register New Profile' : 'Authenticate Existing'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
