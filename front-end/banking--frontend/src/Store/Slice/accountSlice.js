import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async thunks
export const createAccount = createAsyncThunk(
  'account/create',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/accounts');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create account');
    }
  }
);

export const fetchAccount = createAsyncThunk(
  'account/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/accounts');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch account');
    }
  }
);

export const depositMoney = createAsyncThunk(
  'account/deposit',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/accounts/deposit', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Deposit failed');
    }
  }
);



export const transferMoney = createAsyncThunk(
  'account/transfer',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/accounts/transfer', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Transfer failed');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'account/transactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/accounts/transactions');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load transactions');
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account: null,
    transactions: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAccountError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
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

    // Create account
    builder
      .addCase(createAccount.pending, setLoading)
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload;
        state.successMessage = 'Account created successfully!';
      })
      .addCase(createAccount.rejected, setError);

    // Fetch account
    builder
      .addCase(fetchAccount.pending, setLoading)
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload;
      })
      .addCase(fetchAccount.rejected, setError);

    // Deposit
    builder
      .addCase(depositMoney.pending, setLoading)
      .addCase(depositMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload;
        state.successMessage = 'Deposit successful!';
      })
      .addCase(depositMoney.rejected, setError);



    // Transfer
    builder
      .addCase(transferMoney.pending, setLoading)
      .addCase(transferMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload;
        state.successMessage = 'Transfer successful!';
      })
      .addCase(transferMoney.rejected, setError);

    // Transactions
    builder
      .addCase(fetchTransactions.pending, setLoading)
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, setError);
  },
});

export const { clearAccountError, clearSuccessMessage } = accountSlice.actions;
export default accountSlice.reducer;
