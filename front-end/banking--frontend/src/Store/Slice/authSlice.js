import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/login', credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/verify-otp', otpData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

// Async thunks
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (emailData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/forgot-password', emailData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/reset-password', resetData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reset password');
    }
  }
);
const storedUser = () => {
  try {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');
    if (token) return { token, email, fullName, role };
    return null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser(),
    loading: false,
    error: null,
    requiresOtp: false,
    tempEmail: null,
    successMessage: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.requiresOtp = false;
      state.tempEmail = null;
      state.successMessage = null;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('fullName');
      localStorage.removeItem('role');
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthSuccess(state) {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Registration successful. Please wait for admin approval.';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.requiresOtp = false;
        state.tempEmail = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token) {
          // Admin or immediate login
          state.user = action.payload;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('email', action.payload.email);
          localStorage.setItem('fullName', action.payload.fullName);
          localStorage.setItem('role', action.payload.role);
        } else {
          // OTP required
          state.requiresOtp = true;
          state.tempEmail = action.payload.email;
          state.successMessage = action.payload.message || 'OTP sent to email. Please verify to login.';
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.requiresOtp = false;
        state.tempEmail = null;
        state.user = action.payload;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('email', action.payload.email);
        localStorage.setItem('fullName', action.payload.fullName);
        localStorage.setItem('role', action.payload.role);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'OTP sent to email for password reset.';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Password reset successful.';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, clearAuthSuccess } = authSlice.actions;
export default authSlice.reducer;
