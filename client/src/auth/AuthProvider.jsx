import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState([]); // array of venueId strings

  async function refresh() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      setUser(data.user);   // {uid,email,name} or null
      if (data.user) {
        await loadFavorites();
      } else {
        setFavorites([]);
      }
    } finally {
      setReady(true);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function login(name, email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error('login_failed');
    await refresh();
  }

  async function register(name, email, password) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error('register_failed');
    await refresh();
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setFavorites([]);
  }

  async function loadFavorites() {
    const res = await fetch('/api/favorites', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
    }
  }

  async function like(venueId) {
    if (!user) return; // ignore if not logged in
    const res = await fetch(`/api/favorites/${venueId}`, { method: 'POST', credentials: 'include' });
    if (res.ok) setFavorites(prev => (prev.includes(venueId) ? prev : [...prev, venueId]));
  }

  async function unlike(venueId) {
    if (!user) return;
    const res = await fetch(`/api/favorites/${venueId}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) setFavorites(prev => prev.filter(id => id !== venueId));
  }

  return (
    <AuthCtx.Provider value={{ user, ready, favorites, login, register, logout, like, unlike, loadFavorites }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
