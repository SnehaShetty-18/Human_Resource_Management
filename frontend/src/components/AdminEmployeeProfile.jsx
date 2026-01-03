import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminEmployeeProfile() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);

  // Check if user is authenticated and has admin role, if not redirect to login
  if (!user || (user.role !== 'ADMIN' && user.role !== 'HR')) {
    navigate('/login');
    return null;
  }

  // Mock employee data for the profile
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    loginId: 'johndoe',
    email: 'john.doe@company.com',
    mobile: '+1 234 567 8900',
    company: 'Dayflow Inc.',
    department: 'Engineering',
    manager: 'Jane Smith',
    location: 'New York, NY',
    avatar: 'JD',
    
    // Resume Tab
    about: 'Experienced software developer with expertise in React, Node.js, and modern web technologies. Passionate about creating efficient and user-friendly applications.',
    skills: ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'Python'],
    certifications: [
      { name: 'React Developer Certification', issuer: 'Meta', date: '2023' },
      { name: 'JavaScript Specialist', issuer: 'Google', date: '2022' }
    ],
    
    // Private Info Tab
    dob: '1990-05-15',
    address: '123 Main St, New York, NY 10001',
    nationality: 'American',
    personalEmail: 'john.personal@email.com',
    gender: 'Male',
    maritalStatus: 'Single',
    dateOfJoining: '2022-01-15',
    accountNumber: '1234567890',
    bankName: 'ABC Bank',
    ifscCode: 'ABCB0001234',
    panNumber: 'ABCDE1234F',
    uanNumber: '123456789012',
    employeeCode: 'EMP001',
    
    // Salary Info (for admin view)
    monthlyWage: 50000,
    yearlyWage: 600000,
    workingDays: 5,
    breakTime: 1,
    salaryComponents: [
      { name: 'Basic Salary', amount: 25000, percentage: 50 },
      { name: 'House Rent Allowance (HRA)', amount: 10000, percentage: 20 },
      { name: 'Standard Allowance', amount: 5000, percentage: 10 },
      { name: 'Performance Bonus', amount: 2500, percentage: 5 },
      { name: 'Leave Travel Allowance (LTA)', amount: 2500, percentage: 5 },
      { name: 'Fixed Allowance', amount: 5000, percentage: 10 }
    ]
  });

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    // Navigate to the profile page
    navigate('/employee/profile');
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    logout();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleSave = (section) => {
    // In a real app, this would save to the backend
    console.log(`${section} updated:`, profileData[section]);
    alert(`${section} updated successfully!`);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present':
        return '#28a745'; // Green
      case 'leave':
        return '#007bff'; // Blue
      case 'absent':
        return '#ffc107'; // Yellow
      default:
        return '#6c757d'; // Gray
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'present':
        return 'Present in office';
      case 'leave':
        return 'On approved leave';
      case 'absent':
        return 'Absent without leave';
      default:
        return 'Unknown status';
    }
  };

  // Navigation items for admin
  const navItems = [
    { name: 'Employees', path: '/admin-employees' },
    { name: 'Attendance', path: '/admin-dashboard' },
    { name: 'Time Off', path: '/admin-dashboard' }
  ];

  // Function to determine active tab
  const isActiveTab = (path) => {
    return window.location.pathname === path;
  };

  return (
    <div className="admin-employee-profile">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <h2>Dayflow</h2>
          </div>
          <ul className="nav-tabs">
            {navItems.map((item, index) => (
              <li key={index} className={`nav-tab ${isActiveTab(item.path) ? 'active' : ''}`}>
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="nav-right">
          <div className="user-profile" onClick={toggleProfileDropdown}>
            <div className="avatar">
              <span className="avatar-initials">
                {user?.employeeId?.charAt(0).toUpperCase() || 'U'}
              </span>
              <div className="status-dot" style={{ backgroundColor: '#28a745' }}></div>
            </div>
          </div>
          
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <ul>
                <li onClick={handleProfileClick}>My Profile</li>
                <li onClick={handleLogout}>Log Out</li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content-admin">
        <header className="dashboard-header-admin">
          <h1>Employee Profile</h1>
          <p>Manage employee information</p>
        </header>
        
        <div className="profile-container">
          <div className="profile-main">
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar-large">
                <span className="avatar-initials">{profileData.avatar}</span>
                <button className="edit-icon" onClick={toggleEdit}>
                  {isEditing ? '✓' : '✏️'}
                </button>
              </div>
              <div className="profile-basic-info">
                <h2>{profileData.name}</h2>
                <div className="profile-fields">
                  <div className="profile-field-row">
                    <div className="profile-field">
                      <label>Login ID</label>
                      <input 
                        type="text" 
                        name="loginId" 
                        value={profileData.loginId}
                        onChange={(e) => setProfileData({...profileData, loginId: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="profile-field">
                      <label>Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="profile-field-row">
                    <div className="profile-field">
                      <label>Mobile</label>
                      <input 
                        type="text" 
                        name="mobile" 
                        value={profileData.mobile}
                        onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="profile-field">
                      <label>Company</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="profile-field-row">
                    <div className="profile-field">
                      <label>Department</label>
                      <input 
                        type="text" 
                        name="department" 
                        value={profileData.department}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="profile-field">
                      <label>Manager</label>
                      <input 
                        type="text" 
                        name="manager" 
                        value={profileData.manager}
                        onChange={(e) => setProfileData({...profileData, manager: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="profile-field-row">
                    <div className="profile-field">
                      <label>Location</label>
                      <input 
                        type="text" 
                        name="location" 
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-sidebar">
            {/* Profile Tabs */}
            <div className="profile-tabs">
              <button 
                className={`tab-button ${activeTab === 'resume' ? 'active' : ''}`}
                onClick={() => handleTabChange('resume')}
              >
                Resume
              </button>
              <button 
                className={`tab-button ${activeTab === 'private' ? 'active' : ''}`}
                onClick={() => handleTabChange('private')}
              >
                Private Info
              </button>
              {(user.role === 'ADMIN' || user.role === 'HR') && (
                <button 
                  className={`tab-button ${activeTab === 'salary' ? 'active' : ''}`}
                  onClick={() => handleTabChange('salary')}
                >
                  Salary Info
                </button>
              )}
            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'resume' && (
                <div className="tab-pane">
                  <div className="tab-section">
                    <h3>About</h3>
                    <textarea 
                      name="about" 
                      value={profileData.about}
                      onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                      disabled={!isEditing}
                      className="form-control"
                      rows="4"
                    />
                    {isEditing && (
                      <button className="btn btn-primary" onClick={() => handleSave('about')}>
                        Save About
                      </button>
                    )}
                  </div>
                  
                  <div className="tab-section">
                    <h3>Skills</h3>
                    <div className="skills-container">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="tab-section">
                    <h3>Certifications</h3>
                    <div className="certifications-list">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="certification-item">
                          <h4>{cert.name}</h4>
                          <p>Issued by: {cert.issuer}</p>
                          <p>Year: {cert.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'private' && (
                <div className="tab-pane">
                  <div className="tab-section">
                    <h3>Personal Information</h3>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input 
                        type="date" 
                        name="dob" 
                        value={profileData.dob}
                        onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <textarea 
                        name="address" 
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nationality</label>
                      <input 
                        type="text" 
                        name="nationality" 
                        value={profileData.nationality}
                        onChange={(e) => setProfileData({...profileData, nationality: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Personal Email</label>
                      <input 
                        type="email" 
                        name="personalEmail" 
                        value={profileData.personalEmail}
                        onChange={(e) => setProfileData({...profileData, personalEmail: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Gender</label>
                        <select 
                          name="gender" 
                          value={profileData.gender}
                          onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                          disabled={!isEditing}
                          className="form-control"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Marital Status</label>
                        <select 
                          name="maritalStatus" 
                          value={profileData.maritalStatus}
                          onChange={(e) => setProfileData({...profileData, maritalStatus: e.target.value})}
                          disabled={!isEditing}
                          className="form-control"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="tab-section">
                    <h3>Employment Information</h3>
                    <div className="form-group">
                      <label>Date of Joining</label>
                      <input 
                        type="date" 
                        name="dateOfJoining" 
                        value={profileData.dateOfJoining}
                        onChange={(e) => setProfileData({...profileData, dateOfJoining: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Employee Code</label>
                      <input 
                        type="text" 
                        name="employeeCode" 
                        value={profileData.employeeCode}
                        onChange={(e) => setProfileData({...profileData, employeeCode: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="tab-section">
                    <h3>Bank Details</h3>
                    <div className="form-group">
                      <label>Account Number</label>
                      <input 
                        type="text" 
                        name="accountNumber" 
                        value={profileData.accountNumber}
                        onChange={(e) => setProfileData({...profileData, accountNumber: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input 
                        type="text" 
                        name="bankName" 
                        value={profileData.bankName}
                        onChange={(e) => setProfileData({...profileData, bankName: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input 
                        type="text" 
                        name="ifscCode" 
                        value={profileData.ifscCode}
                        onChange={(e) => setProfileData({...profileData, ifscCode: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="tab-section">
                    <h3>Identification Details</h3>
                    <div className="form-group">
                      <label>PAN Number</label>
                      <input 
                        type="text" 
                        name="panNumber" 
                        value={profileData.panNumber}
                        onChange={(e) => setProfileData({...profileData, panNumber: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>UAN Number</label>
                      <input 
                        type="text" 
                        name="uanNumber" 
                        value={profileData.uanNumber}
                        onChange={(e) => setProfileData({...profileData, uanNumber: e.target.value})}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <button className="btn btn-primary" onClick={() => handleSave('privateInfo')}>
                      Save Private Info
                    </button>
                  )}
                </div>
              )}
              
              {activeTab === 'salary' && (
                <div className="tab-pane">
                  <div className="tab-section">
                    <h3>Salary Summary</h3>
                    <div className="salary-summary">
                      <div className="form-group">
                        <label>Monthly Wage</label>
                        <input 
                          type="number" 
                          name="monthlyWage" 
                          value={profileData.monthlyWage || 50000}
                          onChange={(e) => {
                            const newWage = parseInt(e.target.value) || 0;
                            setProfileData(prev => {
                              const updatedData = { ...prev, monthlyWage: newWage };
                              // Auto-calculate components based on wage
                              updatedData.basicSalary = Math.round(newWage * 0.5); // 50% of wage
                              updatedData.hra = Math.round(newWage * 0.2); // 20% of wage
                              updatedData.standardAllowance = Math.round(newWage * 0.1); // 10% of wage
                              updatedData.performanceBonus = Math.round(newWage * 0.05); // 5% of wage
                              updatedData.lta = Math.round(newWage * 0.05); // 5% of wage
                              updatedData.fixedAllowance = newWage - (updatedData.basicSalary + updatedData.hra + updatedData.standardAllowance + updatedData.performanceBonus + updatedData.lta);
                              return updatedData;
                            });
                          }}
                          disabled={!isEditing}
                          className="form-control"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Yearly Wage</label>
                          <input 
                            type="number" 
                            name="yearlyWage" 
                            value={profileData.yearlyWage || (profileData.monthlyWage * 12) || 600000}
                            onChange={(e) => setProfileData({...profileData, yearlyWage: e.target.value})}
                            disabled={!isEditing}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Working Days/Week</label>
                          <input 
                            type="number" 
                            name="workingDays" 
                            value={profileData.workingDays || 5}
                            onChange={(e) => setProfileData({...profileData, workingDays: e.target.value})}
                            disabled={!isEditing}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Break Time (hours)</label>
                        <input 
                          type="number" 
                          name="breakTime" 
                          value={profileData.breakTime || 1}
                          onChange={(e) => setProfileData({...profileData, breakTime: e.target.value})}
                          disabled={!isEditing}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="tab-section">
                    <h3>Salary Components</h3>
                    <div className="salary-components">
                      {profileData.salaryComponents.map((component, index) => (
                        <div key={index} className="salary-component-row">
                          <div className="form-group">
                            <label>Name</label>
                            <input 
                              type="text" 
                              name="name" 
                              value={component.name}
                              onChange={(e) => {
                                const updatedComponents = [...profileData.salaryComponents];
                                updatedComponents[index] = { ...component, name: e.target.value };
                                setProfileData({ ...profileData, salaryComponents: updatedComponents });
                              }}
                              disabled={!isEditing}
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <label>Amount per Month</label>
                            <input 
                              type="number" 
                              name="amount" 
                              value={component.amount}
                              onChange={(e) => {
                                const updatedAmount = parseInt(e.target.value) || 0;
                                const updatedComponents = [...profileData.salaryComponents];
                                const updatedComponent = { ...component, amount: updatedAmount };
                                
                                // Calculate percentage based on monthly wage
                                if (profileData.monthlyWage > 0) {
                                  updatedComponent.percentage = Math.round((updatedAmount / profileData.monthlyWage) * 100);
                                }
                                
                                updatedComponents[index] = updatedComponent;
                                setProfileData({ ...profileData, salaryComponents: updatedComponents });
                              }}
                              disabled={!isEditing}
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <label>Percentage</label>
                            <input 
                              type="number" 
                              name="percentage" 
                              value={component.percentage}
                              onChange={(e) => {
                                const updatedPercentage = parseInt(e.target.value) || 0;
                                const updatedComponents = [...profileData.salaryComponents];
                                const updatedComponent = { ...component, percentage: updatedPercentage };
                                
                                // Calculate amount based on percentage and monthly wage
                                updatedComponent.amount = Math.round((updatedPercentage / 100) * profileData.monthlyWage);
                                
                                updatedComponents[index] = updatedComponent;
                                setProfileData({ ...profileData, salaryComponents: updatedComponents });
                              }}
                              disabled={!isEditing}
                              className="form-control"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="salary-total">
                      <div className="salary-item total">
                        <span>Total:</span>
                        <span className="salary-value">${profileData.salaryComponents.reduce((sum, component) => sum + component.amount, 0).toLocaleString()}</span>
                      </div>
                      {profileData.monthlyWage > 0 && (
                        <div className="salary-item variance">
                          <span>Variance:</span>
                          <span className={`salary-value ${profileData.salaryComponents.reduce((sum, component) => sum + component.amount, 0) > profileData.monthlyWage ? 'exceeds' : 'within'}`}>
                            ${Math.abs(profileData.salaryComponents.reduce((sum, component) => sum + component.amount, 0) - profileData.monthlyWage).toLocaleString()}
                            {profileData.salaryComponents.reduce((sum, component) => sum + component.amount, 0) > profileData.monthlyWage ? ' over' : ' under'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-employee-profile {
          min-height: 100vh;
          background: #f5f7fa;
          font-family: 'Roboto', sans-serif;
          display: flex;
          flex-direction: column;
        }
        
        .dashboard-content-admin {
          flex: 1;
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .profile-container {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 20px;
        }
        
        .profile-main {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        
        .profile-header {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .profile-avatar-large {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          font-size: 2rem;
          color: white;
        }
        
        .edit-icon {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        
        .profile-basic-info h2 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 1.5rem;
          text-align: center;
        }
        
        .profile-fields {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .profile-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .profile-field {
          margin-bottom: 10px;
        }
        
        .profile-field label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }
        
        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.9rem;
          box-sizing: border-box;
        }
        
        .form-control:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }
        
        .profile-sidebar {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          height: fit-content;
        }
        
        .profile-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .tab-button {
          flex: 1;
          padding: 12px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
          color: #6b7280;
          border-bottom: 2px solid transparent;
        }
        
        .tab-button.active {
          color: #2563eb;
          border-bottom: 2px solid #2563eb;
        }
        
        .tab-content {
          padding: 20px;
          flex: 1;
        }
        
        .tab-pane {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .tab-section {
          margin-bottom: 20px;
        }
        
        .tab-section h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }
        
        .skill-tag {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }
        
        .certifications-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .certification-item {
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }
        
        .certification-item h4 {
          margin: 0 0 5px 0;
          color: #374151;
        }
        
        .certification-item p {
          margin: 3px 0;
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .salary-summary {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .salary-components {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .salary-component-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .salary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .salary-item.total {
          font-weight: bold;
          border-top: 1px solid #d1d5db;
          border-bottom: none;
        }
        
        .salary-item.variance {
          font-weight: bold;
          color: #ef4444;
        }
        
        .salary-item.variance.within {
          color: #22c55e;
        }
        
        .salary-value {
          color: #374151;
          font-weight: 500;
        }
        
        .salary-value.exceeds {
          color: #ef4444;
        }
        
        .salary-total {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .btn-primary {
          background-color: #2563eb;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #1d4ed8;
        }
        
        @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
          }
          
          .profile-field-row {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .profile-tabs {
            flex-wrap: wrap;
          }
          
          .tab-button {
            flex: 1 0 auto;
            padding: 10px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminEmployeeProfile;