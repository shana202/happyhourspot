import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider.jsx';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await register(name, email, pw);
      navigate('/');
    } catch (e) {
      setErr(e.message === 'register_failed'
        ? 'Registration failed (email in use?)'
        : 'Registration failed');
    }
  }

  return (
    <main className="container" style={{ maxWidth: 420, marginTop: '2rem' }}>
      <h1>Create account</h1>
      {err && <p style={{ color:'crimson' }}>{err}</p>}
      <form onSubmit={onSubmit}>
        
      <label>Name<br />
          <input type="name" value={name} onChange={e=>setName(e.target.value)} required />
        </label>
        <br /><br />
        <label>Email<br />
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <br /><br />
        <label>Password<br />
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} required />
        </label>
        <br /><br />
        <button type="submit">Register</button>
        <span style={{ marginLeft: 8 }}>
          or <Link to="/login">Log in</Link>
        </span>
      </form>
    </main>
  );
}
