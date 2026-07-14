import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/dashboard');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchPendingUsers = createAsyncThunk(
  'admin/fetchPendingUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/pending-users');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pending users');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/users');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const approveUser = createAsyncThunk(
  'admin/approveUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/admin/approve/${userId}`);
      return { userId, message: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to approve user');
    }
  }
);

export const rejectUser = createAsyncThunk(
  'admin/rejectUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/admin/reject/${userId}`);
      return { userId, message: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reject user');
    }
  }
);

export const fetchAllTransactions = createAsyncThunk(
  'admin/fetchAllTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/transactions');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const cancelTransaction = createAsyncThunk(
  'admin/cancelTransaction',
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/admin/transactions/${transactionId}/cancel`);
      return { transactionId, message: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel transaction');
    }
  }
);

export const approveDeposit = createAsyncThunk(
  'admin/approveDeposit',
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/admin/transactions/${transactionId}/approve`);
      return { transactionId, message: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to approve deposit');
    }
  }
);

export const rejectDeposit = createAsyncThunk(
  'admin/rejectDeposit',
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/admin/transactions/${transactionId}/reject`);
      return { transactionId, message: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reject deposit');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboardStats: null,
    pendingUsers: [],
    allUsers: [],
    allTransactions: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
    clearAdminSuccess(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    };
    const setError = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    // Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, setLoading)
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, setError);

    // Pending Users
    builder
      .addCase(fetchPendingUsers.pending, setLoading)
      .addCase(fetchPendingUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingUsers = action.payload;
      })
      .addCase(fetchPendingUsers.rejected, setError);

    // All Users
    builder
      .addCase(fetchAllUsers.pending, setLoading)
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, setError);

    // Approve User
    builder
      .addCase(approveUser.pending, setLoading)
      .addCase(approveUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingUsers = state.pendingUsers.filter(u => u.id !== action.payload.userId);
        state.successMessage = 'User approved successfully';
      })
      .addCase(approveUser.rejected, setError);

    // Reject User
    builder
      .addCase(rejectUser.pending, setLoading)
      .addCase(rejectUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingUsers = state.pendingUsers.filter(u => u.id !== action.payload.userId);
        state.successMessage = 'User rejected successfully';
      })
      .addCase(rejectUser.rejected, setError);

    // All Transactions
    builder
      .addCase(fetchAllTransactions.pending, setLoading)
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactions = action.payload;
      })
      .addCase(fetchAllTransactions.rejected, setError);

    // Cancel Transaction
    builder
      .addCase(cancelTransaction.pending, setLoading)
      .addCase(cancelTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactions = state.allTransactions.map(t =>
          t.id === action.payload.transactionId ? { ...t, status: 'CANCELLED' } : t
        );
        state.successMessage = 'Transaction cancelled and refunded';
      })
      .addCase(cancelTransaction.rejected, setError);

    // Approve Deposit
    builder
      .addCase(approveDeposit.pending, setLoading)
      .addCase(approveDeposit.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactions = state.allTransactions.map(t =>
          t.id === action.payload.transactionId ? { ...t, status: 'COMPLETED' } : t
        );
        state.successMessage = 'Deposit approved successfully';
      })
      .addCase(approveDeposit.rejected, setError);

    // Reject Deposit
    builder
      .addCase(rejectDeposit.pending, setLoading)
      .addCase(rejectDeposit.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactions = state.allTransactions.map(t =>
          t.id === action.payload.transactionId ? { ...t, status: 'FAILED' } : t
        );
        state.successMessage = 'Deposit rejected';
      })
      .addCase(rejectDeposit.rejected, setError);
  },
});

export const { clearAdminError, clearAdminSuccess } = adminSlice.actions;
export default adminSlice.reducer;
