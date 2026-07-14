import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, approveUser, rejectUser } from '../../Store/Slice/adminSlice';
import Navbar from '../../Component/Navbar';
import SlideBar from '../../Component/SlideBar';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { dashboardStats, loading, error, successMessage } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleApprove = (id) => {
    if (window.confirm("Approve this user and create their bank account?")) {
      dispatch(approveUser(id)).then(() => dispatch(fetchDashboardStats()));
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this registration?")) {
      dispatch(rejectUser(id)).then(() => dispatch(fetchDashboardStats()));
    }
  };

  return (
    <div className="app-layout">
      <SlideBar />
      <main className="main-content">
        <Navbar title="Admin Dashboard" />
        <div className="page-body">
          {error && <div className="alert alert-error">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {loading && !dashboardStats ? (
            <div className="spinner-wrapper"><div className="spinner"></div></div>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">{dashboardStats?.totalUsers || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending Approvals</div>
                  <div className="stat-value text-danger">{dashboardStats?.pendingApprovals || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Accounts</div>
                  <div className="stat-value">{dashboardStats?.totalAccounts || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Transactions</div>
                  <div className="stat-value text-success">{dashboardStats?.totalTransactions || 0}</div>
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">Recent Pending Registrations</h3>
                {dashboardStats?.recentPendingUsers && dashboardStats.recentPendingUsers.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Country</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardStats.recentPendingUsers.map((user) => (
                          <tr key={user.id}>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.country}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(user.id)}>Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleReject(user.id)}>Reject</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No pending registrations at the moment.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
