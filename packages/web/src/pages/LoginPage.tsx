import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authClient } from '../lib/authClient';
import { useAuthStore } from '../stores/auth';
import './LoginPage.css';

type Mode = 'login' | 'signup' | 'verify' | 'forgot' | 'forgot-sent';

export function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const navigate = useNavigate();
  const fetchUser = useAuthStore((s) => s.fetchUser);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await authClient.signUp.email({
          email,
          password,
          username,
          name: username,
          callbackURL: '/?profile_setup=1',
        });
        if (res.error) {
          setError(res.error.message || 'signup failed');
          setLoading(false);
          return;
        }
        localStorage.setItem('needs_profile_setup', 'true');
        setMode('verify');
        setLoading(false);
        return;
      } else if (mode === 'forgot') {
        await fetch('/api/auth/request-password-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: identifier, redirectTo: '/reset-password' }),
        });
        setMode('forgot-sent');
        setLoading(false);
        return;
      } else {
        const isEmail = identifier.includes('@');
        const res = isEmail
          ? await authClient.signIn.email({ email: identifier, password })
          : await authClient.signIn.username({ username: identifier, password });
        if (res.error) {
          if (res.error.code === 'EMAIL_NOT_VERIFIED') {
            if (isEmail) setEmail(identifier);
            setMode('verify');
            setLoading(false);
            return;
          }
          setError(res.error.message || 'login failed');
          setLoading(false);
          return;
        }
      }
      await fetchUser();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      setError('enter your email address above');
      return;
    }
    setResending(true);
    setResent(false);
    setError('');
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: '/?profile_setup=1',
      });
      setResent(true);
    } catch {
      setError('failed to resend verification email');
    } finally {
      setResending(false);
    }
  }

  if (mode === 'verify') {
    return (
      <div className="login-page">
        <div className="card">
          <h1 className="logo">wazup</h1>
          <div className="verify">
            <h2>check your email</h2>
            {email ? (
              <p>
                we sent a verification link to <strong>{email}</strong>
              </p>
            ) : (
              <p>
                enter your email to resend the verification link.
              </p>
            )}
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setResent(false); }}
              autoComplete="email"
            />
            <button
              className="btn btn-primary submit resend"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? '...' : resent ? 'sent!' : 'resend verification email'}
            </button>
            {error && <div className="error">{error}</div>}
            <button
              className="back"
              onClick={() => { setMode('login'); setError(''); setResent(false); }}
            >
              back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'forgot-sent') {
    return (
      <div className="login-page">
        <div className="card">
          <h1 className="logo">wazup</h1>
          <div className="verify">
            <h2>check your email</h2>
            <p>
              if an account exists for <strong>{identifier}</strong>, we sent a password reset link.
            </p>
            <button
              className="back"
              onClick={() => { setMode('login'); setError(''); }}
            >
              back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="card">
        <h1 className="logo">wazup</h1>
        {mode !== 'forgot' && (
          <div className="tabs">
            <button
              className={`tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              log in
            </button>
            <button
              className={`tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); }}
            >
              sign up
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {mode === 'login' && (
            <input
              type="text"
              placeholder="email or name"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
            />
          )}
          {mode === 'signup' && (
            <>
              <input
                type="text"
                placeholder="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </>
          )}
          {mode === 'forgot' && (
            <input
              type="email"
              placeholder="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="email"
            />
          )}
          {mode !== 'forgot' && (
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={8}
            />
          )}
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary submit" disabled={loading}>
            {loading
              ? '...'
              : mode === 'login'
                ? 'log in'
                : mode === 'signup'
                  ? 'sign up'
                  : 'send reset link'}
          </button>
          {mode === 'login' && (
            <button
              type="button"
              className="forgot"
              onClick={() => { setMode('forgot'); setError(''); }}
            >
              forgot password?
            </button>
          )}
          {mode === 'forgot' && (
            <button
              type="button"
              className="back"
              onClick={() => { setMode('login'); setError(''); }}
            >
              back to login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
