import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, verifyOtp, clearAuthError, clearAuthSuccess } from '../Store/Slice/authSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, requiresOtp, tempEmail, successMessage } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (user) navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    return () => {
      dispatch(clearAuthError());
      dispatch(clearAuthSuccess());
    };
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    dispatch(verifyOtp({ email: tempEmail, otp }));
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🏦 SecureBank</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {requiresOtp ? (
          <form onSubmit={handleOtpSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="verify-otp">Enter OTP</label>
              <input
                id="verify-otp"
                type="text"
                className="form-control"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <button
              id="otp-submit-btn"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || otp.length < 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ color: '#00d4ff', fontSize: '14px', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>
        </form>
        )}

        <div className="auth-divider">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
