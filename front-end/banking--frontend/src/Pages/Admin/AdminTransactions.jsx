import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTransactions, cancelTransaction, approveDeposit, rejectDeposit, clearAdminError, clearAdminSuccess } from '../../Store/Slice/adminSlice';
import Navbar from '../../Component/Navbar';
import SlideBar from '../../Component/SlideBar';

function AdminTransactions() {
  const dispatch = useDispatch();
  const { allTransactions, loading, error, successMessage } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllTransactions());
    return () => {
      dispatch(clearAdminError());
      dispatch(clearAdminSuccess());
    };
  }, [dispatch]);

  const handleCancel = (transactionId) => {
    if (window.confirm("Are you sure you want to cancel this transaction? The amount will be refunded.")) {
      dispatch(cancelTransaction(transactionId));
    }
  };

  const handleApprove = (transactionId) => {
    if (window.confirm("Approve this deposit and credit the user's account?")) {
      dispatch(approveDeposit(transactionId));
    }
  };

  const handleReject = (transactionId) => {
    if (window.confirm("Reject this deposit?")) {
      dispatch(rejectDeposit(transactionId));
    }
  };

  return (
    <div className="app-layout">
      <SlideBar />
      <main className="main-content">
        <Navbar title="All Transactions" />
        <div className="page-body">
          <div className="page-header">
            <h1>Transaction History</h1>
            <p>View all platform transactions and manage them</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="card">
            {loading && allTransactions.length === 0 ? (
              <div className="spinner-wrapper"><div className="spinner"></div></div>
            ) : allTransactions.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Check No.</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>#{tx.id}</td>
                        <td>
                          <span className={`badge ${tx.type === 'DEPOSIT' ? 'badge-success' : 'badge-info'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td>
                          <div style={{fontWeight: 600}}>
                            {tx.type === 'TRANSFER' && tx.senderCurrency && tx.receiverCurrency ? (
                              <span>{tx.amount} {tx.senderCurrency} → {tx.convertedAmount} {tx.receiverCurrency}</span>
                            ) : (
                              <span>{tx.amount}</span>
                            )}
                          </div>
                          <div className="stat-sub" style={{marginTop:2}}>{tx.description}</div>
                        </td>
                        <td>{tx.checkNumber || '-'}</td>
                        <td>
                          <span className={`badge ${
                            tx.status === 'COMPLETED' ? 'badge-success' 
                            : tx.status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td>{new Date(tx.createdAt).toLocaleString()}</td>
                        <td>
                          {tx.status === 'COMPLETED' && (
                            <button 
                              className="btn btn-outline btn-danger btn-sm" 
                              onClick={() => handleCancel(tx.id)}
                            >
                              Cancel & Refund
                            </button>
                          )}
                          {tx.status === 'PENDING' && (
                            <div style={{display: 'flex', gap: '8px'}}>
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleApprove(tx.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-outline btn-danger btn-sm" 
                                onClick={() => handleReject(tx.id)}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No transactions found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminTransactions;
