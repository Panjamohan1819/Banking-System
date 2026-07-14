import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword, clearAuthError, clearAuthSuccess } from '../Store/Slice/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaKey, FaArrowLeft } from 'react-icons/fa';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const handleRequestOtp = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
    dispatch(forgotPassword({ email })).unwrap().then(() => {
      setStep(2);
    }).catch(() => {});
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
    dispatch(resetPassword({ email, otp, newPassword })).unwrap().then(() => {
      setTimeout(() => navigate('/'), 2000);
    }).catch(() => {});
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>SecureBank Account Recovery</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>OTP Code</label>
              <div className="input-with-icon">
                <FaKey className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/" className="link" onClick={() => {
            dispatch(clearAuthError());
            dispatch(clearAuthSuccess());
          }}>
            <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
