import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { depositMoney, fetchAccount, clearAccountError, clearSuccessMessage } from '../Store/Slice/accountSlice';
import Navbar from '../Component/Navbar';
import SlideBar from '../Component/SlideBar';

function Deposit() {
  const dispatch = useDispatch();
  const { account, loading, error, successMessage } = useSelector((state) => state.account);

  const [form, setForm] = useState({ amount: '', description: '', checkNumber: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) {
      setLocalError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!form.checkNumber.trim()) {
      setLocalError('Check number is required.');
      return;
    }
    dispatch(depositMoney({ 
      amount: amt, 
      description: form.description, 
      checkNumber: form.checkNumber 
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setForm({ amount: '', description: '', checkNumber: '' });
      }
    });
  };

  const displayError = localError || error;

  return (
    <div className="app-layout">
      <SlideBar />
      <div className="main-content">
        <Navbar title="Deposit" />
        <div className="page-body">

          <div className="page-header">
            <h1>Deposit Money</h1>
            <p>Add funds to your bank account</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800 }}>

            {/* Form */}
            <div className="card">
              <div className="card-title">Enter Deposit Details</div>

              {displayError && <div className="alert alert-error">{displayError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="deposit-amount">Amount (₹)</label>
                  <input
                    id="deposit-amount"
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
                  <label className="form-label" htmlFor="deposit-check">Check Number</label>
                  <input
                    id="deposit-check"
                    type="text"
                    name="checkNumber"
                    className="form-control"
                    placeholder="Enter unique check number"
                    value={form.checkNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="deposit-description">Description (optional)</label>
                  <input
                    id="deposit-description"
                    type="text"
                    name="description"
                    className="form-control"
                    placeholder="e.g. Salary credit"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <button
                  id="deposit-submit-btn"
                  type="submit"
                  className="btn btn-success btn-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Deposit Funds'}
                </button>
              </form>
            </div>

            {/* Account summary */}
            <div className="card">
              <div className="card-title">Account Summary</div>
              {account ? (
                <>
                  <div className="form-group">
                    <div className="stat-label">Account Number</div>
                    <span className="account-badge mt-1">{account.accountNumber}</span>
                  </div>
                  <div className="form-group">
                    <div className="stat-label">Current Balance</div>
                    <div className="stat-value green mt-1">{formatCurrency(account.balance, account.currency)}</div>
                  </div>
                  <div className="form-group">
                    <div className="stat-label">Status</div>
                    <span className={`badge mt-1 ${account.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                      {account.status}
                    </span>
                  </div>
                </>
              ) : (
                <div className="alert alert-info">No account found. Please create an account first.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deposit;
