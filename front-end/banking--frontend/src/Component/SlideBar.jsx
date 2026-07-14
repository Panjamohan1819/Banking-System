import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const userNavItems = [
  { to: '/dashboard',     icon: '🏠', label: 'Dashboard' },
  { to: '/deposit',       icon: '⬇️',  label: 'Deposit' },
  { to: '/transfer',      icon: '↔️',  label: 'Transfer' },
  { to: '/transactions',  icon: '📋', label: 'Transactions' },
  { to: '/beneficiaries', icon: '👥', label: 'Beneficiaries' },
];

const adminNavItems = [
  { to: '/admin/dashboard', icon: '👑', label: 'Dashboard' },
  { to: '/admin/pending-approvals', icon: '⏳', label: 'Pending Approvals' },
  { to: '/admin/users', icon: '👥', label: 'All Users' },
  { to: '/admin/transactions', icon: '📋', label: 'All Transactions' },
];

function SlideBar() {
  const { user } = useSelector((state) => state.auth);
  const navItems = user?.role === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>🏦 SecureBank</h2>
        <p>Banking Portal</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
          © 2025 SecureBank
        </span>
      </div>
    </aside>
  );
}

export default SlideBar;
