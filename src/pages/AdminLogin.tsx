// src/pages/AdminLogin.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authenticateUser } from '../utils/auth';
import '../css/AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const candlesticksRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Generate candlesticks on mount
  useEffect(() => {
    if (candlesticksRef.current) {
      const container = candlesticksRef.current;
      const numCandles = 60;
      for (let i = 0; i < numCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'candlestick';
        const height = Math.random() * 100 + 30;
        const left = (i / numCandles) * 100;
        const bottom = Math.random() * 40 + 10;
        candle.style.height = `${height}px`;
        candle.style.left = `${left}%`;
        candle.style.bottom = `${bottom}%`;
        container.appendChild(candle);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(email.trim().toLowerCase(), password);

    if (user && user.role === 'admin') {
      const token = `admin-token-${Date.now()}`;
      login(token, user);
      navigate('/admin');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="background"></div>
        <div className="chart-overlay"></div>
        <div className="candlestick-pattern" ref={candlesticksRef}></div>

        <div className="login-card">
          <div className="logo">
            <h1><span className="fp">FP</span><span className="markets">Markets</span></h1>
          </div>
          <p className="subtitle">Admin Portal - Sign in to Dashboard</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '14px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Admin Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin address"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />

                <svg
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </>
                  ) : (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </>
                  )}
                </svg>
              </div>
            </div>

            <button type="submit" className="login-button">Sign In to Admin Portal</button>
          </form>

          <div className="signup-section">
            <p className="signup-text" style={{ fontSize: '12px', color: '#666' }}>
              Demo Credentials: admin@admin.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}