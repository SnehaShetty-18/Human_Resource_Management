import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    companyName: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    companyCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.companyName || !formData.adminName || !formData.adminEmail || !formData.adminPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.adminPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // In a real application, you would send this data to your backend
    // For now, let's create a mock admin user and log them in
    const adminUser = {
      employeeId: 'admin',
      role: 'ADMIN',
      isActive: true,
      companyName: formData.companyName,
      adminName: formData.adminName,
      adminEmail: formData.adminEmail
    };
    
    // Login the new admin user
    login(adminUser);
    
    // Show success message
    alert(`Company registration successful!

Company: ${formData.companyName}
Admin: ${formData.adminName}
Email: ${formData.adminEmail}

Employee accounts are created by Admin after login.`);
    
    // Redirect to admin dashboard
    navigate('/admin-dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <h1>Dayflow</h1>
          <p>Human Resource Management System</p>
        </div>
        
        <h2 style={{textAlign: 'center', color: '#2c3e50', marginBottom: '20px', fontSize: '1.5rem'}}>Create Company Account</h2>
        <p style={{textAlign: 'center', color: '#7f8c8d', marginBottom: '20px', fontSize: '0.9rem'}}>Register your company to get started with Dayflow</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="adminName">Admin Name *</label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="Enter admin's full name"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="adminEmail">Admin Email *</label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="Enter admin's email address"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="adminPassword">Admin Password *</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="adminPassword"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                placeholder="Create a strong password"
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
          
          <div className="input-group">
            <label htmlFor="companyCode">Company Code (Optional)</label>
            <input
              type="text"
              id="companyCode"
              name="companyCode"
              value={formData.companyCode}
              onChange={handleChange}
              placeholder="Enter company code if applicable"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-btn">Register Company</button>
        </form>
        
        <div className="login-footer">
          <p>Employee accounts are created by Admin after login.</p>
          <p>Already have an account? <Link to="/login" style={{ color: '#3498db' }}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;