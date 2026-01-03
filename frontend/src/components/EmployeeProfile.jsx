import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EmployeeProfile() {
  const { employeeId: routeEmployeeId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Check if user is authenticated, if not redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Use the logged-in user's information for the profile if no employeeId is provided in route
  const employee = {
    id: routeEmployeeId || user?.employeeId || 'EMP001',
    name: routeEmployeeId || user?.employeeId || 'Employee Name',
    designation: 'Software Developer', // This could come from user object in a real app
    department: 'Engineering', // This could come from user object in a real app
    status: 'present',
    avatar: (routeEmployeeId || user?.employeeId)?.charAt(0).toUpperCase() || 'U',
    email: (routeEmployeeId || user?.employeeId) ? `${routeEmployeeId || user.employeeId}@company.com` : 'employee@company.com',
    employeeId: routeEmployeeId || user?.employeeId || 'EMP001',
    role: 'Employee' // This could come from user object in a real app
  };

  // Navigation items for employee
  const navItems = [
    { name: 'Employees', path: '/employee/employees' },
    { name: 'Attendance', path: '/employee/attendance' },
    { name: 'Time Off', path: '/employee/timeoff' },
    { name: 'My Profile', path: '/employee/profile' }
  ];

  // Function to determine active tab
  const isActiveTab = (path) => {
    return window.location.pathname === path;
  };

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

  return (
    <div className="employee-dashboard">
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
                <li onClick={handleProfileClick}>View Profile</li>
                <li onClick={handleLogout}>Log Out</li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content-employee">
        <header className="dashboard-header-employee">
          <h1>Employee Profile</h1>
          <p>View employee details</p>
        </header>
        
        <div className="profile-container">
          <div className="profile-main">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  <span className="avatar-initials">{employee.avatar}</span>
                  <div 
                    className="status-indicator-large" 
                    style={{ backgroundColor: getStatusColor(employee.status) }}
                    title={getStatusText(employee.status)}
                  ></div>
                </div>
                <div className="profile-basic-info">
                  <h2>{employee.name}</h2>
                  <p className="designation">{employee.role}</p>
                  <p className="department">{employee.department}</p>
                </div>
              </div>
            
            <div className="profile-details">
              <div className="profile-section">
                <div className="profile-row">
                  <div className="profile-field">
                    <label>Employee ID</label>
                    <p>{employee.employeeId}</p>
                  </div>
                  <div className="profile-field">
                    <label>Email</label>
                    <p>{employee.email}</p>
                  </div>
                </div>
                <div className="profile-row">
                  <div className="profile-field">
                    <label>Department</label>
                    <p>{employee.department}</p>
                  </div>
                  <div className="profile-field">
                    <label>Role</label>
                    <p>{employee.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-sidebar">
            <div className="sidebar-section">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn" disabled>Update Profile</button>
                <button className="action-btn" disabled>View Attendance</button>
                <button className="action-btn" disabled>View Leave History</button>
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">✅</span>
                  <div className="activity-details">
                    <p>Updated personal information</p>
                    <span className="activity-time">2 days ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📝</span>
                  <div className="activity-details">
                    <p>Submitted leave request</p>
                    <span className="activity-time">1 week ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">💰</span>
                  <div className="activity-details">
                    <p>Received salary for November</p>
                    <span className="activity-time">1 month ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <style jsx>{`
        .employee-dashboard {
          min-height: 100vh;
          background: #f5f7fa;
          font-family: 'Roboto', sans-serif;
          display: flex;
          flex-direction: column;
        }
        
        .dashboard-content-employee {
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
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        
        .profile-main {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        
        .top-nav {
          background: white;
          padding: 15px 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .nav-left {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        
        .logo h2 {
          margin: 0;
          color: #2563eb;
          font-size: 1.8rem;
        }
        
        .nav-tabs {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 25px;
        }
        
        .nav-tab a, .nav-tab a:link, .nav-tab a:visited {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          padding: 8px 0;
          position: relative;
          transition: color 0.3s ease;
        }
        
        .nav-tab a:hover {
          color: #2563eb;
        }
        
        .nav-tab.active a, .nav-tab.active a:link, .nav-tab.active a:visited {
          color: #2563eb;
        }
        
        .nav-tab a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #2563eb;
          transition: width 0.3s ease;
        }
        
        .nav-tab a:hover::after {
          width: 100%;
        }
        
        .nav-tab.active a::after {
          width: 100%;
        }
        
        .nav-right {
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .user-profile {
          cursor: pointer;
        }
        
        .avatar {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        
        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-radius: 50%;
        }
        
        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-top: 10px;
          z-index: 1000;
          width: 180px;
        }
        
        .profile-dropdown ul {
          list-style: none;
          margin: 0;
          padding: 10px 0;
        }
        
        .profile-dropdown li {
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .profile-dropdown li:hover {
          background: #f8f9fa;
        }
        
        .dashboard-content-employee {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        .dashboard-header-employee {
          margin-bottom: 30px;
        }
        
        .dashboard-header-employee h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 2rem;
        }
        
        .dashboard-header-employee p {
          color: #7f8c8d;
          margin: 5px 0 0 0;
        }
        
        .profile-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        
        .profile-card {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .profile-header {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #ecf0f1;
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
          color: white;
          font-weight: bold;
          font-size: 2rem;
        }
        
        .status-indicator-large {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 25px;
          height: 25px;
          border: 3px solid white;
          border-radius: 50%;
        }
        
        .profile-basic-info h2 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }
        
        .designation {
          margin: 0 0 5px 0;
          color: #7f8c8d;
          font-size: 1.1rem;
        }
        
        .department {
          margin: 0 0 10px 0;
          color: #95a5a6;
          font-style: italic;
          font-size: 1rem;
        }
        
        .status-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .profile-section {
          margin-bottom: 25px;
        }
        
        .profile-section h3 {
          margin: 0 0 15px 0;
          color: #2c3e50;
          border-bottom: 1px solid #ecf0f1;
          padding-bottom: 8px;
        }
        
        .profile-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .profile-field {
          margin-bottom: 10px;
        }
        
        .profile-field.full-width {
          grid-column: 1 / -1;
        }
        
        .profile-field label {
          display: block;
          font-weight: 500;
          color: #7f8c8d;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }
        
        .profile-field p {
          margin: 0;
          color: #2c3e50;
          font-size: 1rem;
        }
        
        .profile-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .sidebar-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .sidebar-section h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #2c3e50;
          border-bottom: 1px solid #ecf0f1;
          padding-bottom: 8px;
        }
        
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .action-btn {
          padding: 10px 15px;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          background: white;
          color: #4a5568;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
        }
        
        .action-btn:hover {
          background: #f7fafc;
          border-color: #a0aec0;
        }
        
        .action-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .activity-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        
        .activity-icon {
          background: #e3f2fd;
          padding: 8px;
          border-radius: 5px;
          min-width: 40px;
          text-align: center;
        }
        
        .activity-details {
          flex: 1;
        }
        
        .activity-details p {
          margin: 0 0 3px 0;
          color: #2c3e50;
        }
        
        .activity-time {
          font-size: 0.8rem;
          color: #7f8c8d;
        }
        
        @media (max-width: 768px) {
          .nav-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .nav-tabs {
            gap: 15px;
          }
          
          .profile-container {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .profile-row {
            grid-template-columns: 1fr;
          }
        }
      </div>
    </div>
  </div>
</nav>
      `}</style>
</div>
  );
}

export default EmployeeProfile;
