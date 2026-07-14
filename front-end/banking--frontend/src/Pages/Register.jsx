import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../Store/Slice/authSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, successMessage } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    country: '',
  });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    return () => dispatch(clearAuthError());
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) return 'Enter a valid 10-digit phone number.';
    if (!form.country) return 'Please select a country.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setLocalError(err); return; }
    dispatch(registerUser(form));
  };

  const displayError = localError || error;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🏦 SecureBank</h1>
          <p>Create your account</p>
        </div>

        {displayError && (
          <div className="alert alert-error" role="alert">
            {displayError}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {successMessage ? (
          <div className="text-center mt-4">
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-fullname">Full Name</label>
            <input
              id="reg-fullname"
              type="text"
              name="fullName"
              className="form-control"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
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
            <label className="form-label" htmlFor="reg-phone">Phone Number</label>
            <input
              id="reg-phone"
              type="tel"
              name="phoneNumber"
              className="form-control"
              placeholder="9XXXXXXXXX"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-country">Country</label>
            <select
              id="reg-country"
              name="country"
              className="form-control"
              value={form.country}
              onChange={handleChange}
              required
            >
              <option value="">Select your country</option>
              <option value="INDIA">India (INR)</option>
              <option value="JAPAN">Japan (JPY)</option>
              <option value="CHINA">China (CNY)</option>
              <option value="SOUTH KOREA">South Korea (KRW)</option>
              <option value="SINGAPORE">Singapore (SGD)</option>
              <option value="MALAYSIA">Malaysia (MYR)</option>
              <option value="INDONESIA">Indonesia (IDR)</option>
              <option value="THAILAND">Thailand (THB)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        )}

        <div className="auth-divider">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
