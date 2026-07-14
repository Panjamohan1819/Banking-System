import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transferMoney, fetchAccount, clearAccountError, clearSuccessMessage } from '../Store/Slice/accountSlice';
import { fetchBeneficiaries } from '../Store/Slice/beneficiarySlice';
import Navbar from '../Component/Navbar';
import SlideBar from '../Component/SlideBar';

function Transfer() {
  const dispatch = useDispatch();
  const { account, loading, error, successMessage } = useSelector((state) => state.account);
  const { beneficiaries } = useSelector((state) => state.beneficiary);

  const [form, setForm] = useState({
    receiverAccountNumber: '',
    amount: '',
    description: '',
  });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    dispatch(fetchBeneficiaries());
    dispatch(fetchAccount());
    return () => {
      dispatch(clearAccountError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);

  const formatCurrency = (amount, currencyCode = 'INR') => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: currencyCode }).format(amount || 0);
    } catch {
      return `${currencyCode} ${amount}`;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
    if (successMessage) dispatch(clearSuccessMessage());
    if (error) dispatch(clearAccountError());
  };

  const handleBeneficiarySelect = (e) => {
    const val = e.target.value;
    if (val) setForm({ ...form, receiverAccountNumber: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.receiverAccountNumber.trim()) {
      setLocalError('Receiver account number is required.');
      return;
    }
    if (!form.amount || isNaN(amt) || amt <= 0) {
      setLocalError('Please enter a valid amount greater than 0.');
      return;
    }
    if (account && amt > parseFloat(account.balance)) {
      setLocalError('Insufficient balance.');
      return;
    }
    if (form.receiverAccountNumber === account?.accountNumber) {
      setLocalError('Cannot transfer to your own account.');
      return;
    }
    dispatch(transferMoney({
      receiverAccountNumber: form.receiverAccountNumber,
      amount: amt,
      description: form.description,
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setForm({ receiverAccountNumber: '', amount: '', description: '' });
      }
    });
  };

  const displayError = localError || error;

  return (
    <div className="app-layout">
      <SlideBar />
      <div className="main-content">
        <Navbar title="Transfer" />
        <div className="page-body">

          <div className="page-header">
            <h1>Transfer Money</h1>
            <p>Send money to another account</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 860 }}>

            {/* Form */}
            <div className="card">
              <div className="card-title">Transfer Details</div>

              {displayError && <div className="alert alert-error">{displayError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <form onSubmit={handleSubmit} noValidate>

                {beneficiaries.length > 0 && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="transfer-beneficiary">Select Beneficiary (optional)</label>
                    <select
                      id="transfer-beneficiary"
                      className="form-control"
                      onChange={handleBeneficiarySelect}
                      defaultValue=""
                    >
                      <option value="">-- Choose a saved beneficiary --</option>
                      {beneficiaries.map((b) => (
                        <option key={b.id} value={b.accountNumber}>
                          {b.beneficiaryName} {b.nickname ? `(${b.nickname})` : ''} — {b.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="transfer-receiver">Receiver Account Number</label>
                  <input
                    id="transfer-receiver"
                    type="text"
                    name="receiverAccountNumber"
                    className="form-control"
                    placeholder="Enter account number"
                    value={form.receiverAccountNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="transfer-amount">Amount (₹)</label>
                  <input
                    id="transfer-amount"
                    type="number"
                    name="amount"
                    className="form-control"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="transfer-description">Description (optional)</label>
                  <input
                    id="transfer-description"
                    type="text"
                    name="description"
                    className="form-control"
                    placeholder="e.g. Rent payment"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <button
                  id="transfer-submit-btn"
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Transfer Funds'}
                </button>
              </form>
            </div>

            {/* Account summary */}
            <div className="card">
              <div className="card-title">Your Account</div>
              {account ? (
                <>
                  <div className="form-group">
                    <div className="stat-label">Account Number</div>
                    <span className="account-badge mt-1">{account.accountNumber}</span>
                  </div>
                  <div className="form-group">
                    <div className="stat-label">Available Balance</div>
                    <div className="stat-value green mt-1">{formatCurrency(account.balance, account.currency)}</div>
                  </div>
                  {form.amount && parseFloat(form.amount) > 0 && (
                    <div className="alert alert-info mt-2">
                      Balance after transfer:{' '}
                      <strong>{formatCurrency(parseFloat(account.balance) - parseFloat(form.amount || 0), account.currency)}</strong>
                    </div>
                  )}
                  {beneficiaries.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div className="stat-label" style={{ marginBottom: 8 }}>Saved Beneficiaries</div>
                      {beneficiaries.map((b) => (
                        <div
                          key={b.id}
                          style={{
                            padding: '8px 10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: 6,
                            marginBottom: 6,
                            cursor: 'pointer',
                            fontSize: 13,
                          }}
                          onClick={() => setForm({ ...form, receiverAccountNumber: b.accountNumber })}
                        >
                          <strong>{b.beneficiaryName}</strong>
                          {b.nickname && <span className="text-muted"> ({b.nickname})</span>}
                          <div className="text-muted" style={{ fontSize: 12 }}>{b.accountNumber}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="alert alert-info">No account found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
