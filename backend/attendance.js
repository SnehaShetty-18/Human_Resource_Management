import pool from './db.js';
import { verifyToken } from './middleware.js';
import { requireHR } from './middleware.js';

// Check-in function
export const checkIn = async (req, res) => {
  try {
    const employeeId = req.user.employee_id; // Extracted from JWT
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const currentTime = new Date(); // Current time

    // Check if already checked in today
    const [existingCheckIn] = await pool.execute(
      'SELECT id FROM attendance WHERE employee_id = ? AND date = ?',
      [employeeId, today]
    );

    if (existingCheckIn.length > 0) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    // Determine if the check-in time is after 09:30 AM
    const checkInHour = currentTime.getHours();
    const checkInMinute = currentTime.getMinutes();
    const isLate = (checkInHour > 9) || (checkInHour === 9 && checkInMinute > 30);
    
    const status = isLate ? 'LATE' : 'PRESENT';

    // Insert attendance record
    await pool.execute(
      'INSERT INTO attendance (employee_id, date, check_in, status) VALUES (?, ?, ?, ?)',
      [employeeId, today, currentTime, status]
    );

    res.status(200).json({ 
      message: `Check-in successful - Status: ${status}`, 
      time: currentTime,
      status: status
    });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ message: 'Error during check-in', error: error.message });
  }
};

// Check-out function
export const checkOut = async (req, res) => {
  try {
    const employeeId = req.user.employee_id; // Extracted from JWT
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Check if there's a check-in record for today
    const [attendanceRecord] = await pool.execute(
      'SELECT id FROM attendance WHERE employee_id = ? AND date = ? AND check_out IS NULL',
      [employeeId, today]
    );

    if (attendanceRecord.length === 0) {
      return res.status(400).json({ message: 'No check-in record found for today' });
    }

    // Update check-out time
    const currentTime = new Date();
    await pool.execute(
      'UPDATE attendance SET check_out = ? WHERE employee_id = ? AND date = ? AND check_out IS NULL',
      [currentTime, employeeId, today]
    );

    res.status(200).json({ message: 'Check-out successful', time: currentTime });
  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ message: 'Error during check-out', error: error.message });
  }
};

// View my attendance
export const viewMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.employee_id; // Extracted from JWT

    // Get attendance records for the employee, ordered by date descending
    const [attendanceRecords] = await pool.execute(
      'SELECT id, employee_id, date, check_in, check_out, status FROM attendance WHERE employee_id = ? ORDER BY date DESC',
      [employeeId]
    );

    res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// View all attendance (HR/Admin only)
export const viewAllAttendance = async (req, res) => {
  try {
    // Get attendance records joined with users table
    const [attendanceRecords] = await pool.execute(`
      SELECT 
        a.id,
        a.employee_id,
        u.first_name,
        u.last_name,
        a.date,
        a.check_in,
        a.check_out,
        a.status
      FROM attendance a
      JOIN users u ON a.employee_id = u.employee_id
      ORDER BY a.date DESC
    `);

    res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ message: 'Error fetching all attendance', error: error.message });
  }
};