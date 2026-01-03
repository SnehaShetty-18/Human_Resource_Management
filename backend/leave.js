import pool from './db.js';
import { verifyToken } from './middleware.js';
import { requireHR } from './middleware.js';

// Apply for leave
export const applyLeave = async (req, res) => {
  try {
    const employeeId = req.user.employee_id; // Extracted from JWT
    const { leave_type, start_date, end_date, reason } = req.body;

    // Validate required fields
    if (!leave_type || !start_date || !end_date || !reason) {
      return res.status(400).json({ message: 'All fields are required: leave_type, start_date, end_date, reason' });
    }

    // Validate leave type
    const validLeaveTypes = ['PAID', 'SICK', 'UNPAID'];
    if (!validLeaveTypes.includes(leave_type.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid leave type. Must be PAID, SICK, or UNPAID' });
    }

    // Insert record into leave_requests with status = PENDING
    const [result] = await pool.execute(
      'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status, applied_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [employeeId, leave_type.toUpperCase(), start_date, end_date, reason, 'PENDING']
    );

    res.status(201).json({ 
      message: 'Leave request submitted successfully', 
      leave_request_id: result.insertId 
    });
  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(500).json({ message: 'Error applying for leave', error: error.message });
  }
};

// View my leaves
export const viewMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user.employee_id; // Extracted from JWT

    // Get leave requests for the employee, ordered by applied_at DESC
    const [leaveRecords] = await pool.execute(
      'SELECT id, leave_type, start_date, end_date, reason, status, applied_at FROM leave_requests WHERE employee_id = ? ORDER BY applied_at DESC',
      [employeeId]
    );

    res.status(200).json({ leaves: leaveRecords });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Error fetching leaves', error: error.message });
  }
};

// View all leaves (HR/Admin only)
export const viewAllLeaves = async (req, res) => {
  try {
    // Get leave requests joined with users table
    const [leaveRecords] = await pool.execute(`
      SELECT 
        lr.id,
        lr.employee_id,
        u.first_name,
        u.last_name,
        lr.leave_type,
        lr.start_date,
        lr.end_date,
        lr.reason,
        lr.status,
        lr.applied_at
      FROM leave_requests lr
      JOIN users u ON lr.employee_id = u.employee_id
      ORDER BY lr.applied_at DESC
    `);

    res.status(200).json({ leaves: leaveRecords });
  } catch (error) {
    console.error('Error fetching all leaves:', error);
    res.status(500).json({ message: 'Error fetching all leaves', error: error.message });
  }
};

// Approve leave
export const approveLeave = async (req, res) => {
  try {
    const hrId = req.user.employee_id; // HR who is approving
    const { leave_request_id, comments } = req.body;

    if (!leave_request_id) {
      return res.status(400).json({ message: 'Leave request ID is required' });
    }

    // Update leave_requests status to APPROVED
    const [updateResult] = await pool.execute(
      'UPDATE leave_requests SET status = ? WHERE id = ?',
      ['APPROVED', leave_request_id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Insert record into approvals table
    await pool.execute(
      'INSERT INTO approvals (leave_request_id, approved_by, action, comments, approved_at) VALUES (?, ?, ?, ?, NOW())',
      [leave_request_id, hrId, 'APPROVED', comments || '']
    );

    // Get the leave request details to update attendance
    const [leaveDetails] = await pool.execute(
      'SELECT employee_id, start_date, end_date FROM leave_requests WHERE id = ?',
      [leave_request_id]
    );

    if (leaveDetails.length > 0) {
      const { employee_id, start_date, end_date } = leaveDetails[0];
      
      // Update attendance table status = 'LEAVE' for affected dates
      // First, generate all dates between start_date and end_date
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      // Update attendance for each day in the range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const currentDate = d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        // Check if attendance record exists for this date
        const [existingAttendance] = await pool.execute(
          'SELECT id FROM attendance WHERE employee_id = ? AND date = ?',
          [employee_id, currentDate]
        );
        
        if (existingAttendance.length > 0) {
          // Update existing attendance record
          await pool.execute(
            'UPDATE attendance SET status = ? WHERE employee_id = ? AND date = ?',
            ['LEAVE', employee_id, currentDate]
          );
        } else {
          // Insert new attendance record for the leave day
          await pool.execute(
            'INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)',
            [employee_id, currentDate, 'LEAVE']
          );
        }
      }
    }

    res.status(200).json({ message: 'Leave approved successfully' });
  } catch (error) {
    console.error('Error approving leave:', error);
    res.status(500).json({ message: 'Error approving leave', error: error.message });
  }
};

// Reject leave
export const rejectLeave = async (req, res) => {
  try {
    const hrId = req.user.employee_id; // HR who is rejecting
    const { leave_request_id, comments } = req.body;

    if (!leave_request_id) {
      return res.status(400).json({ message: 'Leave request ID is required' });
    }

    // Update leave_requests status to REJECTED
    const [updateResult] = await pool.execute(
      'UPDATE leave_requests SET status = ? WHERE id = ?',
      ['REJECTED', leave_request_id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Insert record into approvals table
    await pool.execute(
      'INSERT INTO approvals (leave_request_id, approved_by, action, comments, approved_at) VALUES (?, ?, ?, ?, NOW())',
      [leave_request_id, hrId, 'REJECTED', comments || '']
    );

    res.status(200).json({ message: 'Leave rejected successfully' });
  } catch (error) {
    console.error('Error rejecting leave:', error);
    res.status(500).json({ message: 'Error rejecting leave', error: error.message });
  }
};