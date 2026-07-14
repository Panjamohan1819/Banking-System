import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchBeneficiaries = createAsyncThunk(
  'beneficiary/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/beneficiaries');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load beneficiaries');
    }
  }
);

export const addBeneficiary = createAsyncThunk(
  'beneficiary/add',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/beneficiaries', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add beneficiary');
    }
  }
);

export const deleteBeneficiary = createAsyncThunk(
  'beneficiary/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/beneficiaries/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete beneficiary');
    }
  }
);

const beneficiarySlice = createSlice({
  name: 'beneficiary',
  initialState: {
    beneficiaries: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBeneficiaryError(state) {
      state.error = null;
    },
    clearBeneficiarySuccess(state) {
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

    builder
      .addCase(fetchBeneficiaries.pending, setLoading)
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries = action.payload;
      })
      .addCase(fetchBeneficiaries.rejected, setError);

    builder
      .addCase(addBeneficiary.pending, setLoading)
      .addCase(addBeneficiary.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries.push(action.payload);
        state.successMessage = 'Beneficiary added successfully!';
      })
      .addCase(addBeneficiary.rejected, setError);

    builder
      .addCase(deleteBeneficiary.pending, setLoading)
      .addCase(deleteBeneficiary.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries = state.beneficiaries.filter((b) => b.id !== action.payload);
        state.successMessage = 'Beneficiary removed.';
      })
      .addCase(deleteBeneficiary.rejected, setError);
  },
});

export const { clearBeneficiaryError, clearBeneficiarySuccess } = beneficiarySlice.actions;
export default beneficiarySlice.reducer;
