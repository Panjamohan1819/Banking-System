import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../Store/Slice/adminSlice';
import Navbar from '../../Component/Navbar';
import SlideBar from '../../Component/SlideBar';

function AllUsers() {
  const dispatch = useDispatch();
  const { allUsers, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="app-layout">
      <SlideBar />
      <main className="main-content">
        <Navbar title="All Users" />
        <div className="page-body">
          <div className="page-header">
            <h1>Registered Customers</h1>
            <p>View all approved customers in the system</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="card">
            {loading && allUsers.length === 0 ? (
              <div className="spinner-wrapper"><div className="spinner"></div></div>
            ) : allUsers.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Country</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td style={{fontWeight:500}}>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.country}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No registered customers found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllUsers;
