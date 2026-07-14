import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccount, createAccount } from '../Store/Slice/accountSlice';
import { fetchTransactions } from '../Store/Slice/accountSlice';
import Navbar from '../Component/Navbar';
import SlideBar from '../Component/SlideBar';

function Dashboard() {
  const dispatch = useDispatch();
  const { account, transactions, loading, error } = useSelector((state) => state.account);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAccount());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const formatCurrency = (amount, currencyCode = 'INR') => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: currencyCode }).format(amount || 0);
    } catch {
      return `${currencyCode} ${amount}`;
    }
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const recentTxns = [...(transactions || [])].slice(0, 5);

  const handleCreateAccount = () => {
    dispatch(createAccount());
  };

  return (
    <div className="app-layout">
      <SlideBar />
      <div className="main-content">
        <Navbar title="Dashboard" />
        <div className="page-body">

          <div className="page-header">
            <h1>Welcome back, {user?.fullName?.split(' ')[0] || 'User'} 👋</h1>
            <p>Here&apos;s an overview of your account</p>
          </div>

          {error && !account && (
            <div className="alert alert-error">{error}</div>
          )}

          {loading && !account && (
            <div className="spinner-wrapper"><div className="spinner"></div></div>
          )}

          {!loading && !account && (
            <div className="card" style={{ maxWidth: 480 }}>
              <div className="empty-state">
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏦</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>No bank account yet</p>
                <p>Create your bank account to start banking.</p>
                <button
                  id="create-account-btn"
                  className="btn btn-primary mt-3"
                  onClick={handleCreateAccount}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Bank Account'}
                </button>
              </div>
            </div>
          )}

          {account && (
            <>
              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Available Balance</div>
                  <div className="stat-value green">{formatCurrency(account.balance, account.currency)}</div>
                  <div className="stat-sub">As of today</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Account Number</div>
                  <div style={{ marginTop: 8 }}>
                    <span className="account-badge">{account.accountNumber}</span>
                  </div>
                  <div className="stat-sub">Use this for transfers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Account Status</div>
                  <div style={{ marginTop: 8 }}>
                    <span className={`badge ${account.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                      {account.status}
                    </span>
                  </div>
                  <div className="stat-sub">Opened on {formatDate(account.createdAt)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Transactions</div>
                  <div className="stat-value">{transactions?.length || 0}</div>
                  <div className="stat-sub">All time</div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="card">
                <div className="d-flex justify-between align-center mb-2">
                  <div className="card-title" style={{ marginBottom: 0 }}>Recent Transactions</div>
                </div>

                {recentTxns.length === 0 ? (
                  <div className="empty-state">
                    <p>No transactions yet.</p>
                  </div>
                ) : (
                  <div className="table-wrapper mt-2">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th className="text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTxns.map((txn) => {
                          const isDebit =
                            txn.type === 'WITHDRAWAL' ||
                            (txn.type === 'TRANSFER' && txn.senderAccountNumber === account.accountNumber);
                          let displayAmount = txn.amount;
                          let displayCurrency = account.currency || 'INR';

                          if (txn.type === 'TRANSFER') {
                            if (isDebit) {
                              displayAmount = txn.amount;
                              displayCurrency = txn.senderCurrency || account.currency;
                            } else {
                              displayAmount = txn.convertedAmount || txn.amount;
                              displayCurrency = txn.receiverCurrency || account.currency;
                            }
                          }

                          return (
                            <tr key={txn.id}>
                              <td>{formatDate(txn.createdAt)}</td>
                              <td>
                                <span className={`badge ${txn.type === 'DEPOSIT' ? 'badge-success' : txn.type === 'WITHDRAWAL' ? 'badge-danger' : 'badge-info'}`}>
                                  {txn.type}
                                </span>
                              </td>
                              <td className="text-muted">{txn.description || '—'}</td>
                              <td>
                                <span className={`badge ${txn.status === 'SUCCESS' ? 'badge-success' : 'badge-danger'}`}>
                                  {txn.status}
                                </span>
                              </td>
                              <td className={`text-right ${isDebit ? 'text-danger' : 'text-success'}`} style={{ fontWeight: 600 }}>
                                {isDebit ? '−' : '+'}{formatCurrency(displayAmount, displayCurrency)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
