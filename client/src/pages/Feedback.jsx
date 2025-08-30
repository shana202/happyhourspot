import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Feedback() {
  const { user } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [email, setEmail] = useState('');
  const [venue, setVenue] = useState(params.get('venue') || '');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // 'ok' | 'error' | null
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, venue, message })
      });
      if (!res.ok) throw new Error('submit_failed');
      setResult('ok');
      setEmail(user?.email || '');
      setVenue(params.get('venue') || '');
      setMessage('');
    } catch (e) {
      setResult('error');
      setError('Could not submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="city">
      <header className="city-header">
        <h1>Send Feedback</h1>
  
        <content
  className="feedback-page"
  style={{
    display: "flex",
    justifyContent: "center", // horizontal

    textAlign: "center",      // center text inside
  }}
>
  Have an update or a new submission? Let us know.
</content>
        <Link className="city-back" to="/">← Back to Home</Link>
      </header>

      {result === 'ok' && (
        <div className="city-success" role="status">Thanks! Your feedback was sent.</div>
      )}
      {result === 'error' && (
        <div className="city-error" role="alert">{error}</div>
      )}

      <form onSubmit={onSubmit} className="feedback-form" style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="f-email">Email</label>
          <input
            id="f-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="f-venue">Venue</label>
          <input
            id="f-venue"
            type="text"
            required
            value={venue}
            onChange={e => setVenue(e.target.value)}
            placeholder="Venue name"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="f-message">Message</label>
          <textarea
            id="f-message"
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tell us what’s up…"
            rows={6}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send Feedback'}
        </button>
      </form>
    </main>
  );
}

