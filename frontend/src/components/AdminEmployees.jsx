import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminEmployees() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Check if user is authenticated and has admin role, if not redirect to login
  if (!user || (user.role !== 'ADMIN' && user.role !== 'HR')) {
    navigate('/login');
    return null;
  }

  // Mock employee data for the grid
  const [employees] = useState([
    { id: 1, name: 'John Doe', designation: 'Software Developer', department: 'Engineering', status: 'present', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', designation: 'HR Manager', department: 'HR', status: 'present', avatar: 'JS' },
    { id: 3, name: 'Robert Johnson', designation: 'Sales Executive', department: 'Sales', status: 'leave', avatar: 'RJ' },
    { id: 4, name: 'Emily Davis', designation: 'Marketing Specialist', department: 'Marketing', status: 'absent', avatar: 'ED' },
    { id: 5, name: 'Michael Wilson', designation: 'Finance Analyst', department: 'Finance', status: 'present', avatar: 'MW' },
    { id: 6, name: 'Sarah Brown', designation: 'Support Lead', department: 'Support', status: 'present', avatar: 'SB' },
    { id: 7, name: 'David Taylor', designation: 'Operations Manager', department: 'Operations', status: 'leave', avatar: 'DT' },
    { id: 8, name: 'Lisa Anderson', designation: 'Designer', department: 'Marketing', status: 'absent', avatar: 'LA' },
    { id: 9, name: 'James Wilson', designation: 'Product Manager', department: 'Engineering', status: 'present', avatar: 'JW' },
    { id: 10, name: 'Olivia Martin', designation: 'UX Designer', department: 'Marketing', status: 'present', avatar: 'OM' },
    { id: 11, name: 'William Garcia', designation: 'QA Engineer', department: 'Engineering', status: 'leave', avatar: 'WG' },
    { id: 12, name: 'Sophia Rodriguez', designation: 'Business Analyst', department: 'Strategy', status: 'absent', avatar: 'SR' },
  ]);

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

  const handleEmployeeCardClick = (employeeId) => {
    // Navigate to the specific employee's profile page in editable mode
    navigate(`/admin/employee/${employeeId}`);
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
    <div className="admin-employees-dashboard">
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
          <h1>Employees</h1>
          <p>Manage and view employee information</p>
        </header>
        
        <div className="employees-grid-container">
          <div className="employee-cards">
            {employees.map(employee => (
              <div 
                key={employee.id} 
                className="employee-card"
                onClick={() => handleEmployeeCardClick(employee.id)}
              >
                <div className="employee-avatar">
                  <span className="avatar-initials">{employee.avatar}</span>
                  <div 
                    className="status-indicator" 
                    style={{ backgroundColor: getStatusColor(employee.status) }}
                    title={getStatusText(employee.status)}
                  ></div>
                </div>
                <div className="employee-info">
                  <h3>{employee.name}</h3>
                  <p>{employee.designation}</p>
                  <p className="department">{employee.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-employees-dashboard {
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
        
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
          gap: 5px;
        }
        
        .nav-tab {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .nav-tab:hover {
          background-color: #f1f5f9;
        }
        
        .nav-tab.active {
          background-color: #2563eb;
          color: white;
        }
        
        .nav-tab a {
          text-decoration: none;
          color: inherit;
        }
        
        .nav-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .user-profile {
          position: relative;
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
        }
        
        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 180px;
          z-index: 1000;
          margin-top: 5px;
        }
        
        .profile-dropdown ul {
          list-style: none;
          margin: 0;
          padding: 10px 0;
        }
        
        .profile-dropdown li {
          padding: 10px 20px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .profile-dropdown li:hover {
          background-color: #f1f5f9;
        }
        
        .dashboard-header-admin {
          margin-bottom: 20px;
        }
        
        .dashboard-header-admin h1 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 1.8rem;
        }
        
        .dashboard-header-admin p {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
        }
        
        .employees-grid-container {
          flex: 1;
        }
        
        .employee-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .employee-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        
        .employee-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        
        .employee-avatar {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          font-size: 1.2rem;
          color: white;
        }
        
        .employee-info {
          text-align: center;
        }
        
        .employee-info h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1.1rem;
        }
        
        .employee-info p {
          margin: 0 0 4px 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .employee-info .department {
          color: #95a5a6;
          font-style: italic;
          font-size: 0.85rem;
        }
        
        .status-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 0 2px white;
        }
        
        @media (max-width: 768px) {
          .top-nav {
            padding: 15px;
          }
          
          .nav-left {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
          
          .nav-tabs {
            gap: 5px;
          }
          
          .nav-tab {
            padding: 6px 12px;
            font-size: 0.8rem;
          }
          
          .employee-cards {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .dashboard-content-admin {
            padding: 15px;
          }
        }
        
        @media (max-width: 480px) {
          .employee-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminEmployees;