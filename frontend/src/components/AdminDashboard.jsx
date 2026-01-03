import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Mock data for dashboard widgets
  const [dashboardData] = useState({
    totalEmployees: 142,
    presentToday: 128,
    pendingLeaveRequests: 15,
    departmentsCount: 8
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin-dashboard' },
    { name: 'Employees', icon: '👥', path: '/employees' },
    { name: 'Attendance', icon: '✅', path: '/attendance' },
    { name: 'Leave Requests', icon: '📝', path: '/leave-requests' },
    { name: 'Approvals', icon: '✅', path: '/approvals' },
    { name: 'Salary', icon: '💰', path: '/salary' },
    { name: 'Reports', icon: '📈', path: '/reports' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Dayflow</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar-item">
              <a href={item.path} className="sidebar-link">
                <span className="icon">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </a>
            </li>
          ))}
          <li className="sidebar-item logout-item">
            <button onClick={handleLogout} className="sidebar-link logout-btn">
              <span className="icon">🚪</span>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="dashboard-header">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>Admin Dashboard</h1>
          <div className="welcome">
            Welcome to Dayflow HR Management System
          </div>
        </header>
        
        <div className="dashboard-content">
          {/* Dashboard Widgets */}
          <div className="dashboard-widgets">
            <div className="widget">
              <div className="widget-icon">👥</div>
              <div className="widget-info">
                <h3>Total Employees</h3>
                <p className="widget-value">{dashboardData.totalEmployees}</p>
              </div>
            </div>
            
            <div className="widget">
              <div className="widget-icon">✅</div>
              <div className="widget-info">
                <h3>Present Today</h3>
                <p className="widget-value">{dashboardData.presentToday}</p>
              </div>
            </div>
            
            <div className="widget">
              <div className="widget-icon">📝</div>
              <div className="widget-info">
                <h3>Pending Leave Requests</h3>
                <p className="widget-value">{dashboardData.pendingLeaveRequests}</p>
              </div>
            </div>
            
            <div className="widget">
              <div className="widget-icon">🏢</div>
              <div className="widget-info">
                <h3>Departments</h3>
                <p className="widget-value">{dashboardData.departmentsCount}</p>
              </div>
            </div>
          </div>
          
          {/* Dashboard Charts/Tables Section */}
          <div className="dashboard-sections">
            <div className="section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">✅</span>
                  <div className="activity-details">
                    <p>John Doe clocked in at 9:00 AM</p>
                    <span className="activity-time">2 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📝</span>
                  <div className="activity-details">
                    <p>Sarah Smith submitted a leave request</p>
                    <span className="activity-time">15 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">👥</span>
                  <div className="activity-details">
                    <p>New employee added: Michael Brown</p>
                    <span className="activity-time">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="section">
              <h2>Upcoming Events</h2>
              <div className="events-list">
                <div className="event-item">
                  <span className="event-date">Jan 10</span>
                  <div className="event-details">
                    <p>Team Meeting</p>
                    <span className="event-time">10:00 AM</span>
                  </div>
                </div>
                <div className="event-item">
                  <span className="event-date">Jan 12</span>
                  <div className="event-details">
                    <p>Payroll Processing</p>
                    <span className="event-time">All Day</span>
                  </div>
                </div>
                <div className="event-item">
                  <span className="event-date">Jan 15</span>
                  <div className="event-details">
                    <p>Performance Reviews</p>
                    <span className="event-time">9:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        
        .sidebar {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          width: 250px;
          transition: all 0.3s ease;
          z-index: 100;
        }
        
        .sidebar.closed {
          width: 60px;
        }
        
        .sidebar.open {
          width: 250px;
        }
        
        .sidebar-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        .sidebar-toggle {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        
        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sidebar-item {
          padding: 15px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-link {
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: background 0.3s ease;
          padding: 8px;
          border-radius: 5px;
        }
        
        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .logout-btn {
          background: #e74c3c;
          width: 100%;
          text-align: left;
        }
        
        .logout-btn:hover {
          background: #c0392b;
        }
        
        .icon {
          font-size: 1.2rem;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
          background: #f5f7fa;
          overflow-y: auto;
        }
        
        .main-content.sidebar-closed {
          margin-left: 60px;
        }
        
        .main-content.sidebar-open {
          margin-left: 250px;
        }
        
        .dashboard-header {
          background: white;
          padding: 15px 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .sidebar-toggle-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 5px;
        }
        
        .dashboard-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }
        
        .welcome {
          margin-left: auto;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .dashboard-content {
          padding: 20px;
          flex: 1;
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
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            transform: translateX(-100%);
          }
          
          .sidebar.open {
            transform: translateX(0);
            width: 250px;
          }
          
          .main-content {
            margin-left: 0 !important;
          }
          
          .dashboard-sections {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;