import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../Store/Slice/accountSlice';
import Navbar from '../Component/Navbar';
import SlideBar from '../Component/SlideBar';

function Transaction() {
  const dispatch = useDispatch();
  const { account, transactions, loading, error } = useSelector((state) => state.account);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
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
    dateStr
      ? new Date(dateStr).toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      : '—';

  const filtered = filter === 'ALL'
    ? transactions
    : transactions.filter((t) => t.type === filter);

  const typeBadge = (type) => {
    if (type === 'DEPOSIT') return 'badge-success';
    if (type === 'WITHDRAWAL') return 'badge-danger';
    return 'badge-info';
  };

  return (
    <div className="app-layout">
      <SlideBar />
      <div className="main-content">
        <Navbar title="Transactions" />
        <div className="page-body">

          <div className="page-header">
            <h1>Transaction History</h1>
            <p>All your account transactions</p>
          </div>

          {/* Filter tabs */}
          <div className="d-flex gap-2 mb-3">
            {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map((f) => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="spinner-wrapper"><div className="spinner"></div></div>
          ) : (
            <div className="card">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: 36 }}>📋</div>
                  <p>No {filter !== 'ALL' ? filter.toLowerCase() : ''} transactions found.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date & Time</th>
                        <th>Type</th>
                        <th>From / To</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((txn, idx) => {
                        const isDebit =
                          txn.type === 'WITHDRAWAL' ||
                          (txn.type === 'TRANSFER' && txn.senderAccountNumber === account?.accountNumber);
                        
                        let displayAmount = txn.amount;
                        let displayCurrency = account?.currency || 'INR';

                        if (txn.type === 'TRANSFER') {
                          if (isDebit) {
                            displayAmount = txn.amount;
                            displayCurrency = txn.senderCurrency || account?.currency || 'INR';
                          } else {
                            displayAmount = txn.convertedAmount || txn.amount;
                            displayCurrency = txn.receiverCurrency || account?.currency || 'INR';
                          }
                        }

                        return (
                          <tr key={txn.id}>
                            <td className="text-muted">{idx + 1}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{formatDate(txn.createdAt)}</td>
                            <td><span className={`badge ${typeBadge(txn.type)}`}>{txn.type}</span></td>
                            <td style={{ fontSize: 12, color: '#64748b' }}>
                              {txn.type === 'TRANSFER' ? (
                                <>
                                  <div>From: {txn.senderAccountNumber || '—'}</div>
                                  <div>To: {txn.receiverAccountNumber || '—'}</div>
                                </>
                              ) : '—'}
                            </td>
                            <td className="text-muted">{txn.description || '—'}</td>
                            <td>
                              <span className={`badge ${txn.status === 'SUCCESS' ? 'badge-success' : 'badge-danger'}`}>
                                {txn.status}
                              </span>
                            </td>
                            <td className={`text-right ${isDebit ? 'text-danger' : 'text-success'}`} style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Transaction;
