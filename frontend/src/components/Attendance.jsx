import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Attendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Attendance state
  const [attendanceStatus, setAttendanceStatus] = useState('offline'); // 'offline', 'checked-in', 'checked-out'
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  
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

  // Mock attendance data
  useEffect(() => {
    // Generate mock attendance data for the current month
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const mockData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Skip weekends (Saturday and Sunday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Randomly generate attendance data
        const isPresent = Math.random() > 0.2; // 80% chance of being present
        let checkIn = null;
        let checkOut = null;
        let workHours = 0;
        let extraHours = 0;
        
        if (isPresent) {
          // Generate check-in between 8:00 AM and 10:00 AM
          const checkInHour = 8 + Math.floor(Math.random() * 3);
          const checkInMinute = Math.floor(Math.random() * 60);
          checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}`;
          
          // Generate check-out between 5:00 PM and 8:00 PM
          const checkOutHour = 17 + Math.floor(Math.random() * 4);
          const checkOutMinute = Math.floor(Math.random() * 60);
          checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}`;
          
          // Calculate work hours
          const [inHour, inMinute] = checkIn.split(':').map(Number);
          const [outHour, outMinute] = checkOut.split(':').map(Number);
          
          let totalMinutes = (outHour * 60 + outMinute) - (inHour * 60 + inMinute);
          
          // Subtract lunch break (1 hour)
          totalMinutes -= 60;
          
          workHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          
          // Calculate extra hours (anything over 8 hours)
          if (workHours > 8) {
            extraHours = workHours - 8;
            workHours = 8;
          }
        }
        
        mockData.push({
          id: day,
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          checkIn,
          checkOut,
          workHours,
          extraHours,
          status: isPresent ? 'present' : 'absent'
        });
      }
    }
    
    setAttendanceData(mockData);
  }, [currentMonth]);

  // Calculate summary data
  const presentDays = attendanceData.filter(record => record.status === 'present').length;
  const absentDays = attendanceData.filter(record => record.status === 'absent').length;
  const totalWorkingDays = presentDays + absentDays;

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

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
          <h1>Attendance</h1>
          <div className="month-selector">
            <button className="nav-arrow" onClick={goToPreviousMonth}>
              &lt;
            </button>
            <select 
              value={formatMonth(currentMonth)} 
              onChange={(e) => {
                const [month, year] = e.target.value.split(' ');
                const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth();
                setCurrentMonth(new Date(parseInt(year), monthIndex, 1));
              }}
              className="month-dropdown"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date(currentMonth.getFullYear(), i, 1);
                return (
                  <option key={i} value={formatMonth(date)}>
                    {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </option>
                );
              })}
            </select>
            <button className="nav-arrow" onClick={goToNextMonth}>
              &gt;
            </button>
          </div>
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
            
            {/* Summary Cards */}
            <div className="attendance-summary">
              <div className="summary-card">
                <div className="summary-icon">✅</div>
                <div className="summary-info">
                  <h3>{presentDays}</h3>
                  <p>Days Present</p>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="summary-icon">🏖️</div>
                <div className="summary-info">
                  <h3>{absentDays}</h3>
                  <p>Leaves</p>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="summary-icon">📅</div>
                <div className="summary-info">
                  <h3>{totalWorkingDays}</h3>
                  <p>Total Working Days</p>
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
          <div className="attendance-section-right">
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
            
            {/* Attendance Table */}
            <div className="attendance-table-container">
              <h2>Attendance Details</h2>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Work Hours</th>
                    <th>Extra Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map(record => (
                    <tr key={record.id}>
                      <td>{formatDate(record.date)}</td>
                      <td>{record.day}</td>
                      <td>{record.checkIn || '-'}</td>
                      <td>{record.checkOut || '-'}</td>
                      <td>{record.workHours > 0 ? `${record.workHours}h` : '-'}</td>
                      <td className={record.extraHours > 0 ? 'extra-hours' : ''}>
                        {record.extraHours > 0 ? `+${record.extraHours}h` : '-'}
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
        
        .month-selector {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .nav-arrow {
          background: #2563eb;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .month-dropdown {
          padding: 5px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          font-size: 1rem;
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
        
        .attendance-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .summary-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .summary-icon {
          font-size: 2rem;
        }
        
        .summary-info h3 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }
        
        .summary-info p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
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
        
        .attendance-section-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .attendance-table-container {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
        }
        
        .attendance-table-container h2 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #2c3e50;
        }
        
        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }
        
        .attendance-table th,
        .attendance-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .attendance-table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .attendance-table tr:hover {
          background-color: #f8fafc;
        }
        
        .extra-hours {
          color: #28a745;
          font-weight: bold;
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
          
          .month-selector {
            width: 100%;
            justify-content: center;
          }
          
          .dashboard-layout {
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

export default Attendance;