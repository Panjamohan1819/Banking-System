import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slice/authSlice';
import accountReducer from './Slice/accountSlice';
import beneficiaryReducer from './Slice/beneficiarySlice';
import adminReducer from './Slice/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    beneficiary: beneficiaryReducer,
    admin: adminReducer,
  },
});

export default store;
