import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Attendance state
  const [attendanceStatus, setAttendanceStatus] = useState('offline'); // 'offline', 'checked-out'
  const [checkInTime, setCheckInTime] = useState(null);
  
  // Mock data for employee dashboard
  const [dashboardData] = useState({
    employeeName: 'John Doe',
    department: 'Engineering',
    position: 'Software Developer',
    attendanceRate: '98%',
    pendingLeaves: 2
  });
  
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
  ]);
  
  // Navigation items for employee
  const navItems = [
    { name: 'Employees', path: '/employee/employees' },
    { name: 'Attendance', path: '/employee/attendance' },
    { name: 'Time Off', path: '/employee/timeoff' }
  ];

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
    // In a real app, this would navigate to the employee's information page
    alert(`Viewing employee details for employee ID: ${employeeId}`);
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
  
  const handleAttendanceToggle = () => {
    if (attendanceStatus === 'offline') {
      // Check in
      const now = new Date();
      setCheckInTime(now);
      setAttendanceStatus('checked-in');
    } else if (attendanceStatus === 'checked-in') {
      // Check out
      setAttendanceStatus('checked-out');
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              <li key={index} className="nav-tab">
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="nav-right">
          <div className="attendance-toggle">
            <button 
              className="attendance-btn"
              onClick={handleAttendanceToggle}
              style={{
                backgroundColor: attendanceStatus === 'checked-out' ? '#6c757d' : 
                           attendanceStatus === 'checked-in' ? '#28a745' : '#dc3545',
                cursor: attendanceStatus === 'checked-out' ? 'not-allowed' : 'pointer',
                opacity: attendanceStatus === 'checked-out' ? 0.6 : 1
              }}
              disabled={attendanceStatus === 'checked-out'}
            >
              {attendanceStatus === 'checked-in' ? 'Checked In' : 'Check In'}
              {checkInTime && attendanceStatus === 'checked-in' && (
                <span className="check-in-time-display"> Since {formatTime(checkInTime)}</span>
              )}
            </button>
          </div>
          
          <div className="user-profile" onClick={toggleProfileDropdown}>
            <div className="avatar">
              <span className="avatar-initials">
                {user?.employeeId?.charAt(0).toUpperCase() || 'U'}
              </span>
              <div className="status-dot"></div>
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
          <h1>Welcome, {user?.employeeId || 'Employee'}</h1>
          <p>Here's your HR dashboard overview</p>
        </header>
        
        <div className="dashboard-sections">
          <div className="dashboard-main">
            <div className="dashboard-widgets">
              <div className="widget">
                <div className="widget-icon">👤</div>
                <div className="widget-info">
                  <h3>Employee Name</h3>
                  <p className="widget-value">{dashboardData.employeeName}</p>
                </div>
              </div>
              
              <div className="widget">
                <div className="widget-icon">🏢</div>
                <div className="widget-info">
                  <h3>Department</h3>
                  <p className="widget-value">{dashboardData.department}</p>
                </div>
              </div>
              
              <div className="widget">
                <div className="widget-icon">💼</div>
                <div className="widget-info">
                  <h3>Position</h3>
                  <p className="widget-value">{dashboardData.position}</p>
                </div>
              </div>
              
              <div className="widget">
                <div className="widget-icon">✅</div>
                <div className="widget-info">
                  <h3>Attendance Rate</h3>
                  <p className="widget-value">{dashboardData.attendanceRate}</p>
                </div>
              </div>
            </div>
            
            <div className="section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">✅</span>
                  <div className="activity-details">
                    <p>You clocked in at 9:00 AM</p>
                    <span className="activity-time">Today, 9:00 AM</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📝</span>
                  <div className="activity-details">
                    <p>Your leave request for Jan 15 has been approved</p>
                    <span className="activity-time">Yesterday</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">💰</span>
                  <div className="activity-details">
                    <p>Payroll for December has been processed</p>
                    <span className="activity-time">Dec 31</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="attendance-section">
            <h2>Attendance</h2>
            <div className="attendance-buttons">
              <button 
                className={`attendance-btn check-in ${attendanceStatus === 'checked-in' ? 'disabled' : ''}`}
                onClick={handleCheckIn}
                disabled={attendanceStatus === 'checked-in'}
              >
                Check In →
              </button>
              
              {checkInTime && (
                <div className="check-in-time">
                  Since {formatTime(checkInTime)}
                </div>
              )}
              
              <button 
                className={`attendance-btn check-out ${attendanceStatus !== 'checked-in' ? 'disabled' : ''}`}
                onClick={handleCheckOut}
                disabled={attendanceStatus !== 'checked-in'}
              >
                Check Out →
              </button>
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
        
        .dashboard-sections {
          flex: 1;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        
        .dashboard-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
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
        
        .attendance-toggle {
          margin-right: 15px;
        }
        
        .attendance-btn {
          padding: 8px 15px;
          border: none;
          border-radius: 20px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .check-in-time-display {
          font-size: 0.8rem;
          opacity: 0.9;
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
        
        .attendance-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .attendance-section h2 {
          margin-top: 0;
          color: #2c3e50;
          border-bottom: 1px solid #ecf0f1;
          padding-bottom: 10px;
        }
        
        .attendance-buttons {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 15px;
        }
        
        .attendance-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .check-in {
          background: #28a745;
          color: white;
        }
        
        .check-out {
          background: #dc3545;
          color: white;
        }
        
        .attendance-btn:hover:not(.disabled) {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        
        .attendance-btn.disabled {
          background: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .check-in-time {
          text-align: center;
          font-size: 0.9rem;
          color: #6c757d;
          margin: 10px 0;
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
        
        .dashboard-widgets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .widget {
          background: white;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }
        
        .widget:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .widget-icon {
          font-size: 2rem;
        }
        
        .widget-info h3 {
          margin: 0 0 5px 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .widget-value {
          margin: 0;
          font-size: 2rem;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .employee-grid {
          margin-bottom: 30px;
        }
        
        .employee-grid h2 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }
        
        .employee-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .employee-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        
        .employee-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
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
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          margin-bottom: 15px;
        }
        
        .status-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-radius: 50%;
        }
        
        .employee-info h3 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }
        
        .employee-info p {
          margin: 0 0 3px 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .employee-info .department {
          color: #95a5a6;
          font-style: italic;
        }
        
        .dashboard-sections {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        
        .section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .section h2 {
          margin-top: 0;
          color: #2c3e50;
          border-bottom: 1px solid #ecf0f1;
          padding-bottom: 10px;
        }
        
        .activity-list, .events-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .activity-item, .event-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        
        .activity-icon, .event-date {
          background: #e3f2fd;
          padding: 8px;
          border-radius: 5px;
          min-width: 40px;
          text-align: center;
        }
        
        .activity-details, .event-details {
          flex: 1;
        }
        
        .activity-details p, .event-details p {
          margin: 0 0 3px 0;
          color: #2c3e50;
        }
        
        .activity-time, .event-time {
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
          
          .dashboard-sections {
            grid-template-columns: 1fr;
          }
          
          .employee-cards {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

export default EmployeeDashboard;