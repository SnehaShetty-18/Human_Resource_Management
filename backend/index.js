import express from 'express';
import cors from 'cors';
import pool from './db.js';
import { createEmployee, login, changePassword, deactivateEmployee } from './auth.js';
import { requireHR } from './middleware.js';
import { updateUsersTable } from './db.js';
import { verifyToken } from './middleware.js';
import { checkIn, checkOut, viewMyAttendance, viewAllAttendance } from './attendance.js';
import { applyLeave, viewMyLeaves, viewAllLeaves, approveLeave, rejectLeave } from './leave.js';
import { setSalary, viewMySalary, viewAllSalaries } from './salary.js';
import { getAttendanceReport, getSalaryReport } from './reports.js';

const app = express();

app.use(cors());
app.use(express.json());

// Update the users table structure on startup
updateUsersTable();

app.get('/', (req, res) => {
  res.send('Dayflow HRMS Backend Running');
});

app.get('/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('SELECT 1');
    connection.release();
    res.send('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection failed');
  }
});

// HR route to create employee
app.post('/api/hr/create-employee', requireHR, createEmployee);

// HR route to deactivate employee
app.post('/api/hr/deactivate-employee', requireHR, deactivateEmployee);

// Auth routes
app.post('/api/auth/login', login);
app.post('/api/auth/change-password', verifyToken, changePassword);

// Attendance routes
app.post('/api/attendance/check-in', verifyToken, checkIn);
app.post('/api/attendance/check-out', verifyToken, checkOut);
app.get('/api/attendance/my', verifyToken, viewMyAttendance);
app.get('/api/attendance/all', requireHR, viewAllAttendance);

// Leave routes
app.post('/api/leave/apply', verifyToken, applyLeave);
app.get('/api/leave/my', verifyToken, viewMyLeaves);
app.get('/api/leave/all', requireHR, viewAllLeaves);
app.post('/api/leave/approve', requireHR, approveLeave);
app.post('/api/leave/reject', requireHR, rejectLeave);

// Salary routes
app.post('/api/salary/set', requireHR, setSalary);
app.get('/api/salary/my', verifyToken, viewMySalary);
app.get('/api/salary/all', requireHR, viewAllSalaries);

// Reports routes
app.get('/api/reports/attendance', requireHR, getAttendanceReport);
app.get('/api/reports/salary', requireHR, getSalaryReport);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});