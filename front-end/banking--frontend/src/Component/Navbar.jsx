import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Store/Slice/authSlice';

function Navbar({ title }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-title">{title || 'Dashboard'}</div>
      <div className="navbar-right">
        <div className="navbar-user">
          Welcome, <span>{user?.fullName || 'User'}</span>
          {user?.role === 'ADMIN' && <span className="badge badge-warning" style={{marginLeft: '8px'}}>ADMIN</span>}
          {user?.role === 'CUSTOMER' && <span className="badge badge-info" style={{marginLeft: '8px'}}>CUSTOMER</span>}
        </div>
        <button
          id="logout-btn"
          className="btn btn-outline btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
