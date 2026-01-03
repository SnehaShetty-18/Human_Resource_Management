import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Basic validation
    if (!employeeId || !password) {
      setError('Please enter both Employee ID and Password');
      return;
    }

    try {
      // Simulate authentication request
      const response = await authenticateUser(employeeId, password);
      
      if (response.success) {
        if (response.isActive) {
          // Login the user
          login({
            employeeId: response.employeeId,
            role: response.role,
            isActive: response.isActive
          });
          
          // Redirect based on role
          if (response.role === 'ADMIN' || response.role === 'HR') {
            navigate('/admin-dashboard');
          } else if (response.role === 'EMPLOYEE') {
            navigate('/employee-dashboard');
          } else {
            setError('Invalid user role');
          }
        } else {
          setError('Account is inactive. Please contact HR for assistance.');
        }
      } else {
        setError(response.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    }
  };

  // Function to simulate authentication (in a real app, this would be an API call)
  async function authenticateUser(employeeId, password) {
    // In a real application, this would be an API call to your backend
    // For demonstration, we'll simulate different responses
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate checking credentials against a database
        // This is just for demonstration - in a real app, credentials would be verified server-side
        if (employeeId === 'admin' && password === 'admin123') {
          resolve({
            success: true,
            isActive: true,
            role: 'ADMIN',
            employeeId: 'admin'
          });
        } else if (employeeId === 'hr' && password === 'hr123') {
          resolve({
            success: true,
            isActive: true,
            role: 'HR',
            employeeId: 'hr'
          });
        } else if (employeeId === 'emp' && password === 'emp123') {
          resolve({
            success: true,
            isActive: true,
            role: 'EMPLOYEE',
            employeeId: 'emp'
          });
        } else if (employeeId === 'inactive' && password === 'inactive123') {
          resolve({
            success: true,
            isActive: false,
            role: 'EMPLOYEE',
            employeeId: 'inactive'
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid Employee ID or Password'
          });
        }
      }, 800); // Simulate network delay
    });
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <h1>Dayflow</h1>
          <p>Human Resource Management System</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🔒' : '👁️'}
              </span>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        
        <div className="login-footer">
          <p>Access is restricted to authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}

export default Login;