import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TimeOff() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Attendance state
  const [attendanceStatus, setAttendanceStatus] = useState('offline'); // 'offline', 'checked-in', 'checked-out'
  const [checkInTime, setCheckInTime] = useState(null);
  
  // Time Off modal state
  const [showModal, setShowModal] = useState(false);
  const [timeOffData, setTimeOffData] = useState({
    employee: user?.employeeId || 'Employee',
    timeOffType: '',
    startDate: '',
    endDate: '',
    days: 0,
    attachment: null
  });
  const [errors, setErrors] = useState({});
  
  // Check if user is authenticated, if not redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }
  
  // Mock data for employee dashboard
  const [dashboardData] = useState({
    employeeName: 'John Doe',
    department: 'Engineering',
    position: 'Software Developer',
    attendanceRate: '98%',
    pendingLeaves: 2
  });
  
  // Mock leave balance data
  const [leaveBalance] = useState({
    paidTimeOff: 24,
    sickTimeOff: 7
  });
  
  // Mock leave records data
  const [leaveRecords] = useState([
    { id: 1, employeeName: 'John Doe', startDate: '2023-12-15', endDate: '2023-12-20', timeOffType: 'Vacation', status: 'Approved' },
    { id: 2, employeeName: 'John Doe', startDate: '2023-11-10', endDate: '2023-11-12', timeOffType: 'Sick Leave', status: 'Approved' },
    { id: 3, employeeName: 'John Doe', startDate: '2023-10-05', endDate: '2023-10-07', timeOffType: 'Personal', status: 'Rejected' },
    { id: 4, employeeName: 'John Doe', startDate: '2023-09-20', endDate: '2023-09-22', timeOffType: 'Vacation', status: 'Approved' },
    { id: 5, employeeName: 'John Doe', startDate: '2023-08-15', endDate: '2023-08-17', timeOffType: 'Sick Leave', status: 'Pending' },
  ]);
  
  // Navigation items for employee
  const navItems = [
    { name: 'Employees', path: '/employee/employees' },
    { name: 'Attendance', path: '/employee/attendance' },
    { name: 'Time Off', path: '/employee/timeoff' }
  ];

  // Function to determine active tab
  const isActiveTab = (path) => {
    return location.pathname === path;
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

  const handleNewLeave = () => {
    // Reset form and open modal
    setTimeOffData({
      employee: user?.employeeId || 'Employee',
      timeOffType: '',
      startDate: '',
      endDate: '',
      days: 0,
      attachment: null
    });
    setErrors({});
    setShowModal(true);
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    setErrors({});
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTimeOffData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If start date or end date changes, recalculate days
    if (name === 'startDate' || name === 'endDate') {
      const startDate = value && name === 'startDate' ? new Date(value) : timeOffData.startDate ? new Date(timeOffData.startDate) : null;
      const endDate = value && name === 'endDate' ? new Date(value) : timeOffData.endDate ? new Date(timeOffData.endDate) : null;
      
      if (startDate && endDate) {
        if (startDate <= endDate) {
          // Calculate the difference in days
          const timeDiff = endDate.getTime() - startDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
          setTimeOffData(prev => ({
            ...prev,
            days: daysDiff
          }));
          
          // Clear any date-related errors
          setErrors(prev => ({
            ...prev,
            date: ''
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            date: 'End date cannot be before start date'
          }));
        }
      } else if (startDate && !endDate) {
        // If only start date is set, set days to 1 initially
        setTimeOffData(prev => ({
          ...prev,
          days: 1
        }));
      } else {
        // If dates are cleared, reset days
        setTimeOffData(prev => ({
          ...prev,
          days: 0
        }));
      }
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTimeOffData(prev => ({
      ...prev,
      attachment: file
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!timeOffData.timeOffType) {
      newErrors.timeOffType = 'Time off type is required';
    }
    
    if (!timeOffData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!timeOffData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (timeOffData.startDate && timeOffData.endDate) {
      const startDate = new Date(timeOffData.startDate);
      const endDate = new Date(timeOffData.endDate);
      
      if (startDate > endDate) {
        newErrors.date = 'End date cannot be before start date';
      }
    }
    
    if (timeOffData.timeOffType === 'Sick Leave' && !timeOffData.attachment) {
      newErrors.attachment = 'Attachment is mandatory for Sick Leave';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would send the data to the backend
      console.log('Submitting time off request:', timeOffData);
      
      // For now, just close the modal
      setShowModal(false);
      setErrors({});
      
      // Add the new leave to the records
      const newLeave = {
        id: leaveRecords.length + 1,
        employeeName: timeOffData.employee,
        startDate: timeOffData.startDate,
        endDate: timeOffData.endDate,
        timeOffType: timeOffData.timeOffType,
        status: 'Pending'
      };
      
      // Update the leave records (in a real app, this would be done via API call)
      // For this demo, we'll just log it
      console.log('New leave request added:', newLeave);
    }
  };
  
  const handleDiscard = () => {
    setShowModal(false);
    setErrors({});
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved':
        return '#28a745'; // Green
      case 'Rejected':
        return '#dc3545'; // Red
      case 'Pending':
        return '#ffc107'; // Yellow
      default:
        return '#6c757d'; // Gray
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'Approved':
        return 'Approved';
      case 'Rejected':
        return 'Rejected';
      case 'Pending':
        return 'Pending Approval';
      default:
        return 'Unknown';
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
            </div>
          </div>
          
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    <span className="avatar-initials">{user?.employeeId?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <div className="profile-basic-info">
                    <h3>{user?.employeeId || 'Employee'}</h3>
                    <p className="designation">Software Developer</p>
                    <p className="department">Engineering</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="profile-field">
                    <label>Email</label>
                    <p>{user?.employeeId ? `${user.employeeId}@company.com` : 'employee@company.com'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Employee ID</label>
                    <p>{user?.employeeId || 'N/A'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Department</label>
                    <p>Engineering</p>
                  </div>
                </div>
              </div>
              <ul className="dropdown-actions">
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
          <h1>Time Off</h1>
          <button className="new-leave-btn" onClick={handleNewLeave}>
            NEW
          </button>
        </header>
        
        <div className="dashboard-layout">
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
            
            {/* Leave Balance Section */}
            <div className="leave-balance-section">
              <h2>Leave Balance</h2>
              <div className="leave-balance-cards">
                <div className="leave-balance-card">
                  <div className="leave-icon">🏖️</div>
                  <div className="leave-info">
                    <h3>Paid Time Off</h3>
                    <p className="leave-days">{leaveBalance.paidTimeOff} days</p>
                  </div>
                </div>
                
                <div className="leave-balance-card">
                  <div className="leave-icon">🤒</div>
                  <div className="leave-info">
                    <h3>Sick Time Off</h3>
                    <p className="leave-days">{leaveBalance.sickTimeOff} days</p>
                  </div>
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
          
          {/* Right Section */}
          <div className="time-off-section-right">
            <div className="section">
              <h2>Pending Requests</h2>
              <div className="events-list">
                <div className="event-item">
                  <span className="event-date">{dashboardData.pendingLeaves}</span>
                  <div className="event-details">
                    <p>Leave Requests</p>
                    <span className="event-time">Pending Approval</span>
                  </div>
                </div>
                <div className="event-item">
                  <span className="event-date">1</span>
                  <div className="event-details">
                    <p>Overtime Requests</p>
                    <span className="event-time">Pending Approval</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Time Off Types Info Box */}
            <div className="time-off-types-box">
              <h2>Time Off Types</h2>
              <ul className="time-off-types-list">
                <li className="time-off-type-item">
                  <span className="type-icon">🏖️</span>
                  <span className="type-name">Paid Time Off</span>
                </li>
                <li className="time-off-type-item">
                  <span className="type-icon">🤒</span>
                  <span className="type-name">Sick Leave</span>
                </li>
                <li className="time-off-type-item">
                  <span className="type-icon">😴</span>
                  <span className="type-name">Unpaid Leaves</span>
                </li>
              </ul>
            </div>
            
            {/* Leave Records Table */}
            <div className="leave-records-container">
              <h2>Leave Records</h2>
              <table className="leave-records-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Time Off Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRecords.map(record => (
                    <tr key={record.id}>
                      <td>{record.employeeName}</td>
                      <td>{record.startDate}</td>
                      <td>{record.endDate}</td>
                      <td>{record.timeOffType}</td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(record.status) }}
                        >
                          {getStatusText(record.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        
        .dashboard-layout {
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
        
        .profile-dropdown {
          width: 300px;
        }
        
        .profile-info {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }
        
        .profile-avatar-large {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .profile-basic-info h3 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }
        
        .designation, .department {
          margin: 0;
          font-size: 0.9rem;
          color: #7f8c8d;
        }
        
        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .profile-field {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #f1f1f1;
          padding-bottom: 8px;
        }
        
        .profile-field label {
          font-weight: 500;
          color: #7f8c8d;
          font-size: 0.8rem;
        }
        
        .profile-field p {
          margin: 0;
          color: #2c3e50;
          font-size: 0.9rem;
          text-align: right;
        }
        
        .dropdown-actions {
          list-style: none;
          margin: 0;
          padding: 10px 0;
        }
        
        .dropdown-actions li {
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .dropdown-actions li:hover {
          background: #f8f9fa;
        }
        
        .dashboard-content-employee {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        .dashboard-header-employee {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .dashboard-header-employee h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 2rem;
        }
        
        .new-leave-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .new-leave-btn:hover {
          background: #1d4ed8;
        }
        
        .dashboard-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        
        .dashboard-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .dashboard-widgets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
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
        
        .leave-balance-section {
          margin-bottom: 20px;
        }
        
        .leave-balance-section h2 {
          margin: 0 0 15px 0;
          color: #2c3e50;
        }
        
        .leave-balance-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .leave-balance-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .leave-icon {
          font-size: 2rem;
        }
        
        .leave-info h3 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }
        
        .leave-days {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
          color: #2563eb;
        }
        
        .employee-grid {
          margin-bottom: 20px;
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
        
        .time-off-section-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .leave-records-container {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
        }
        
        .leave-records-container h2 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #2c3e50;
        }
        
        .leave-records-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        
        .leave-records-table th,
        .leave-records-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .leave-records-table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .leave-records-table tr:hover {
          background-color: #f8fafc;
        }
        
        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
          font-weight: 500;
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
          
          .dashboard-header-employee {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .new-leave-btn {
            width: 100%;
            text-align: center;
          }
          
          .dashboard-layout {
            grid-template-columns: 1fr;
          }
          
          .employee-cards {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 10px 20px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-close:hover {
          color: #333;
        }
        
        .modal-form {
          padding: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        
        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
        }
        
        .form-control:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        .form-help {
          display: block;
          color: #6c757d;
          font-size: 0.85rem;
          margin-top: 5px;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.85rem;
          margin-top: 5px;
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #0056b3;
        }
        
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover {
          background-color: #545b62;
        }
        
        /* Time Off Types Info Box */
        .time-off-types-box {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .time-off-types-box h2 {
          margin: 0 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
          color: #333;
          font-size: 1.2rem;
        }
        
        .time-off-types-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .time-off-type-item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }
        
        .time-off-type-item:last-child {
          border-bottom: none;
        }
        
        .type-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }
        
        .type-name {
          color: #495057;
          font-size: 0.95rem;
        }
      `}</style>
      
      {/* Time Off Request Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Time Off Type Request</h2>
              <button className="modal-close" onClick={handleModalClose}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Employee</label>
                <input 
                  type="text" 
                  name="employee" 
                  value={timeOffData.employee}
                  onChange={handleInputChange}
                  disabled
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Time Off Type *</label>
                <select 
                  name="timeOffType" 
                  value={timeOffData.timeOffType}
                  onChange={handleInputChange}
                  className="form-control"
                  style={{ borderColor: errors.timeOffType ? '#dc3545' : '' }}
                >
                  <option value="">Select Time Off Type</option>
                  <option value="Paid Time Off">Paid Time Off</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
                {errors.timeOffType && <div className="error-message">{errors.timeOffType}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={timeOffData.startDate}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ borderColor: errors.startDate || errors.date ? '#dc3545' : '' }}
                  />
                  {errors.startDate && <div className="error-message">{errors.startDate}</div>}
                </div>
                
                <div className="form-group">
                  <label>End Date *</label>
                  <input 
                    type="date" 
                    name="endDate" 
                    value={timeOffData.endDate}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ borderColor: errors.endDate || errors.date ? '#dc3545' : '' }}
                  />
                  {errors.endDate && <div className="error-message">{errors.endDate}</div>}
                  {errors.date && <div className="error-message">{errors.date}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Allocation (Number of days)</label>
                <input 
                  type="number" 
                  name="days" 
                  value={timeOffData.days}
                  disabled
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Attachment</label>
                <input 
                  type="file" 
                  name="attachment" 
                  onChange={handleFileChange}
                  className="form-control"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ borderColor: errors.attachment ? '#dc3545' : '' }}
                />
                {timeOffData.timeOffType === 'Sick Leave' && (
                  <small className="form-help">Attachment is mandatory for Sick Leave</small>
                )}
                {errors.attachment && <div className="error-message">{errors.attachment}</div>}
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleDiscard}>Discard</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeOff;