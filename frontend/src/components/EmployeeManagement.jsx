import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EmployeeManagement() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState([
    { id: 1, employeeId: 'EMP001', name: 'John Doe', email: 'john.doe@company.com', role: 'EMPLOYEE', department: 'Engineering', phone: '+1 234 567 8900', address: '123 Main St, City, State', isActive: true },
    { id: 2, employeeId: 'EMP002', name: 'Jane Smith', email: 'jane.smith@company.com', role: 'HR', department: 'HR', phone: '+1 234 567 8901', address: '456 Oak Ave, City, State', isActive: true },
    { id: 3, employeeId: 'EMP003', name: 'Robert Johnson', email: 'robert.johnson@company.com', role: 'EMPLOYEE', department: 'Sales', phone: '+1 234 567 8902', address: '789 Pine Rd, City, State', isActive: false },
    { id: 4, employeeId: 'EMP004', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'EMPLOYEE', department: 'Marketing', phone: '+1 234 567 8903', address: '321 Elm St, City, State', isActive: true },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: '',
    name: '',
    email: '',
    role: 'EMPLOYEE',
    department: 'Engineering',
    phone: '',
    address: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Support', 'Management'];
  const roles = ['HR', 'EMPLOYEE'];

  const handleAddEmployee = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newEmployee.employeeId || !newEmployee.name || !newEmployee.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Check if employee ID already exists
    if (employees.some(emp => emp.employeeId === newEmployee.employeeId)) {
      alert('Employee ID already exists');
      return;
    }
    
    // Check if email already exists
    if (employees.some(emp => emp.email === newEmployee.email)) {
      alert('Email already exists');
      return;
    }
    
    // Create new employee
    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      isActive: true
    };
    
    setEmployees([...employees, employee]);
    setNewEmployee({
      employeeId: '',
      name: '',
      email: '',
      role: 'EMPLOYEE',
      department: 'Engineering',
      phone: '',
      address: ''
    });
    setShowAddForm(false);
  };

  const toggleEmployeeStatus = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, isActive: !emp.isActive } : emp
    ));
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || (user.role !== 'ADMIN' && user.role !== 'HR')) {
    navigate('/login');
    return null;
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar open">
        <div className="sidebar-header">
          <h2>Dayflow</h2>
        </div>
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <a href="/admin-dashboard" className="sidebar-link">
              <span className="icon">📊</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li className="sidebar-item active">
            <a href="/employee-management" className="sidebar-link">
              <span className="icon">👥</span>
              <span>Employees</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="/attendance" className="sidebar-link">
              <span className="icon">✅</span>
              <span>Attendance</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="/leave-requests" className="sidebar-link">
              <span className="icon">📝</span>
              <span>Leave Requests</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="/approvals" className="sidebar-link">
              <span className="icon">✅</span>
              <span>Approvals</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="/salary" className="sidebar-link">
              <span className="icon">💰</span>
              <span>Salary</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="/reports" className="sidebar-link">
              <span className="icon">📈</span>
              <span>Reports</span>
            </a>
          </li>
          <li className="sidebar-item logout-item">
            <button onClick={logout} className="sidebar-link logout-btn">
              <span className="icon">🚪</span>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content sidebar-open">
        <header className="dashboard-header">
          <h1>Employee Management</h1>
          <div className="welcome">
            Welcome, {user.employeeId}
          </div>
        </header>
        
        <div className="dashboard-content">
          <div className="employee-management">
            <div className="management-header">
              <h2>Manage Employees</h2>
              <button 
                className="add-employee-btn" 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : '+ Add Employee'}
              </button>
            </div>
            
            {showAddForm && (
              <div className="add-employee-form">
                <h3>Add New Employee</h3>
                <form onSubmit={handleAddEmployee}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="employeeId">Employee ID *</label>
                      <input
                        type="text"
                        id="employeeId"
                        value={newEmployee.employeeId}
                        onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                        placeholder="Enter employee ID"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="role">Role</label>
                      <select
                        id="role"
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <select
                        id="department"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      value={newEmployee.address}
                      onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                      placeholder="Enter address"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-btn">Add Employee</button>
                </form>
              </div>
            )}
            
            <div className="employee-list-section">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="employee-table-container">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(employee => (
                      <tr key={employee.id}>
                        <td>{employee.employeeId}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.role}</td>
                        <td>{employee.department}</td>
                        <td>{employee.phone}</td>
                        <td>
                          <span className={`status ${employee.isActive ? 'active' : 'inactive'}`}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={`status-toggle ${employee.isActive ? 'deactivate' : 'activate'}`}
                            onClick={() => toggleEmployeeStatus(employee.id)}
                          >
                            {employee.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .employee-management {
          width: 100%;
        }
        
        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .management-header h2 {
          margin: 0;
          color: #2c3e50;
        }
        
        .add-employee-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s ease;
        }
        
        .add-employee-btn:hover {
          background: #1d4ed8;
        }
        
        .add-employee-form {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .add-employee-form h3 {
          margin-top: 0;
          color: #2c3e50;
          border-bottom: 1px solid #ecf0f1;
          padding-bottom: 10px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          margin-bottom: 5px;
          color: #2c3e50;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          font-size: 1rem;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        .submit-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s ease;
        }
        
        .submit-btn:hover {
          background: #1d4ed8;
        }
        
        .employee-list-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .search-filter {
          margin-bottom: 20px;
        }
        
        .search-input {
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          width: 300px;
          font-size: 1rem;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        .employee-table-container {
          overflow-x: auto;
        }
        
        .employee-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }
        
        .employee-table th,
        .employee-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .employee-table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .employee-table tr:hover {
          background-color: #f8fafc;
        }
        
        .status {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .status.active {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status.inactive {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .status-toggle {
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .status-toggle.activate {
          background-color: #28a745;
          color: white;
        }
        
        .status-toggle.deactivate {
          background-color: #dc3545;
          color: white;
        }
        
        .status-toggle:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

export default EmployeeManagement;