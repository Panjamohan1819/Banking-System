import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Component/ProtectedRoute';
import ChatbotPlaceholder from './Component/ChatbotPlaceholder';

// Public pages
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';

// Protected pages
import Dashboard from './Pages/Dashboard';
import Deposit from './Pages/Deposit';
import Transfer from './Pages/Transfer';
import Transaction from './Pages/Transaction';
import Beneficiary from './Pages/Beneficiary';

// Admin pages
import AdminDashboard from './Pages/Admin/AdminDashboard';
import PendingApprovals from './Pages/Admin/PendingApprovals';
import AllUsers from './Pages/Admin/AllUsers';
import AdminTransactions from './Pages/Admin/AdminTransactions';

function App() {
  return (
    <>
      <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deposit"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <Deposit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfer"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <Transfer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <Transaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/beneficiaries"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <Beneficiary />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pending-approvals"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <PendingApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AllUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminTransactions />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ChatbotPlaceholder />
    </>
  );
}

export default App;
