import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingUsers, approveUser, rejectUser, clearAdminError, clearAdminSuccess } from '../../Store/Slice/adminSlice';
import Navbar from '../../Component/Navbar';
import SlideBar from '../../Component/SlideBar';

function PendingApprovals() {
  const dispatch = useDispatch();
  const { pendingUsers, loading, error, successMessage } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPendingUsers());
    return () => {
      dispatch(clearAdminError());
      dispatch(clearAdminSuccess());
    };
  }, [dispatch]);

  const handleApprove = (id) => {
    if (window.confirm("Approve this user and create their bank account?")) {
      dispatch(approveUser(id));
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this registration?")) {
      dispatch(rejectUser(id));
    }
  };

  return (
    <div className="app-layout">
      <SlideBar />
      <main className="main-content">
        <Navbar title="Pending Approvals" />
        <div className="page-body">
          <div className="page-header">
            <h1>Pending Registrations</h1>
            <p>Review and approve user registrations</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="card">
            {loading && pendingUsers.length === 0 ? (
              <div className="spinner-wrapper"><div className="spinner"></div></div>
            ) : pendingUsers.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Country</th>
                      <th>Registered On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td><span className="badge badge-info">{user.country}</span></td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
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
                <div style={{fontSize:'32px', marginBottom:'10px'}}>✅</div>
                <h3>All caught up!</h3>
                <p>There are no pending registrations.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PendingApprovals;
