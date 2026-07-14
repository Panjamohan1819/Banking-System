import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBeneficiaries,
  addBeneficiary,
  deleteBeneficiary,
  clearBeneficiaryError,
  clearBeneficiarySuccess,
} from '../Store/Slice/beneficiarySlice';
import Navbar from '../Component/Navbar';
import SlideBar from '../Component/SlideBar';

function Beneficiary() {
  const dispatch = useDispatch();
  const { beneficiaries, loading, error, successMessage } = useSelector((state) => state.beneficiary);

  const [form, setForm] = useState({ beneficiaryName: '', accountNumber: '', nickname: '' });
  const [localError, setLocalError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchBeneficiaries());
    return () => {
      dispatch(clearBeneficiaryError());
      dispatch(clearBeneficiarySuccess());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
    if (error) dispatch(clearBeneficiaryError());
    if (successMessage) dispatch(clearBeneficiarySuccess());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.beneficiaryName.trim()) { setLocalError('Beneficiary name is required.'); return; }
    if (!form.accountNumber.trim()) { setLocalError('Account number is required.'); return; }
    dispatch(addBeneficiary(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setForm({ beneficiaryName: '', accountNumber: '', nickname: '' });
        setShowForm(false);
      }
    });
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    dispatch(deleteBeneficiary(id)).then(() => setDeleteId(null));
  };

  const displayError = localError || error;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="app-layout">
      <SlideBar />
      <div className="main-content">
        <Navbar title="Beneficiaries" />
        <div className="page-body">

          <div className="page-header d-flex justify-between align-center">
            <div>
              <h1>Beneficiaries</h1>
              <p>Manage your saved recipients for quick transfers</p>
            </div>
            <button
              id="toggle-add-beneficiary-btn"
              className="btn btn-primary"
              onClick={() => { setShowForm(!showForm); setLocalError(''); dispatch(clearBeneficiaryError()); }}
            >
              {showForm ? '✕ Cancel' : '+ Add Beneficiary'}
            </button>
          </div>

          {displayError && <div className="alert alert-error">{displayError}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Add form */}
          {showForm && (
            <div className="card mb-3" style={{ maxWidth: 520 }}>
              <div className="card-title">New Beneficiary</div>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="ben-name">Full Name</label>
                  <input
                    id="ben-name"
                    type="text"
                    name="beneficiaryName"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={form.beneficiaryName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="ben-account">Account Number</label>
                  <input
                    id="ben-account"
                    type="text"
                    name="accountNumber"
                    className="form-control"
                    placeholder="Enter account number"
                    value={form.accountNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="ben-nickname">Nickname (optional)</label>
                  <input
                    id="ben-nickname"
                    type="text"
                    name="nickname"
                    className="form-control"
                    placeholder="e.g. Brother, Landlord"
                    value={form.nickname}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    id="add-beneficiary-submit-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Beneficiary'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {loading && beneficiaries.length === 0 ? (
            <div className="spinner-wrapper"><div className="spinner"></div></div>
          ) : beneficiaries.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div style={{ fontSize: 36 }}>👥</div>
                <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>No beneficiaries yet</p>
                <p>Click &quot;Add Beneficiary&quot; to save a recipient for quick transfers.</p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-title">Saved Beneficiaries ({beneficiaries.length})</div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Nickname</th>
                      <th>Account Number</th>
                      <th>Added On</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiaries.map((b, idx) => (
                      <tr key={b.id}>
                        <td className="text-muted">{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{b.beneficiaryName}</td>
                        <td className="text-muted">{b.nickname || '—'}</td>
                        <td><span className="account-badge">{b.accountNumber}</span></td>
                        <td className="text-muted">{formatDate(b.createdAt)}</td>
                        <td className="text-right">
                          <button
                            id={`delete-beneficiary-${b.id}`}
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(b.id)}
                            disabled={deleteId === b.id}
                          >
                            {deleteId === b.id ? 'Removing...' : 'Remove'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Beneficiary;
