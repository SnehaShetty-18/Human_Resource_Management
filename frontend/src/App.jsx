import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeProfile from './components/EmployeeProfile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import AdminEmployees from './components/AdminEmployees';
import AdminEmployeeProfile from './components/AdminEmployeeProfile';
import EmployeeDashboard from './components/EmployeeDashboard';
import LandingPage from './components/LandingPage';
import EmployeeManagement from './components/EmployeeManagement';
import Attendance from './components/Attendance';
import TimeOff from './components/TimeOff';
import Employees from './components/Employees';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes for ADMIN and HR */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Employee Management route for ADMIN and HR */}
        <Route 
          path="/employee-management" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
              <EmployeeManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect from old employee dashboard to new employees page */}
        <Route 
          path="/employee-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Navigate to="/employee/employees" replace />
            </ProtectedRoute>
          } 
        />
        
        {/* Employees route for EMPLOYEE */}
        <Route 
          path="/employees" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Employees />
            </ProtectedRoute>
          } 
        />
        
        {/* Attendance route for EMPLOYEE */}
        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Attendance />
            </ProtectedRoute>
          } 
        />
        
        {/* Time Off route for EMPLOYEE */}
        <Route 
          path="/time-off" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <TimeOff />
            </ProtectedRoute>
          } 
        />
        
        {/* Employee routes */}
        <Route 
          path="/employee/employees" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Employees />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employee/attendance" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Attendance />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employee/timeoff" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <TimeOff />
            </ProtectedRoute>
          } 
        />
        
        {/* Employee Profile route for EMPLOYEE */}
        <Route 
          path="/employee/profile/:employeeId" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* My Profile route for EMPLOYEE */}
        <Route 
          path="/employee/profile" 
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Dashboard route */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Employees route */}
        <Route 
          path="/admin-employees" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
              <AdminEmployees />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Employee Profile route */}
        <Route 
          path="/admin/employee/:employeeId" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
              <AdminEmployeeProfile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;