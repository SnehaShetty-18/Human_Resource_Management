import pool from './db.js';
import { requireHR } from './middleware.js';

// Generate attendance report
export const getAttendanceReport = async (req, res) => {
  try {
    const hrId = req.user.employee_id; // HR/Admin employee_id from JWT
    const { from_date, to_date } = req.query;

    let query = `
      SELECT 
        u.employee_id,
        u.first_name,
        u.last_name,
        a.date,
        a.check_in,
        a.check_out,
        a.status
      FROM attendance a
      JOIN users u ON a.employee_id = u.employee_id
    `;
    
    const params = [];
    if (from_date || to_date) {
      query += ' WHERE';
      if (from_date) {
        query += ' a.date >= ?';
        params.push(from_date);
        if (to_date) {
          query += ' AND';
        }
      }
      if (to_date) {
        query += ' a.date <= ?';
        params.push(to_date);
      }
    }
    
    query += ' ORDER BY a.date DESC, u.first_name, u.last_name';

    const [attendanceRecords] = await pool.execute(query, params);

    // Insert a record into reports table
    await pool.execute(
      'INSERT INTO reports (report_type, generated_for, generated_by, created_at) VALUES (?, ?, ?, NOW())',
      ['ATTENDANCE', `${from_date || 'ALL'} to ${to_date || 'ALL'}`, hrId]
    );

    res.status(200).json({ 
      report_type: 'ATTENDANCE',
      generated_at: new Date(),
      data: attendanceRecords 
    });
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({ message: 'Error generating attendance report', error: error.message });
  }
};

// Generate salary report
export const getSalaryReport = async (req, res) => {
  try {
    const hrId = req.user.employee_id; // HR/Admin employee_id from JWT

    // Fetch salary data joined with users
    const [salaryRecords] = await pool.execute(`
      SELECT 
        s.employee_id,
        u.first_name,
        u.last_name,
        s.base_salary,
        s.hra,
        s.allowances,
        s.deductions,
        s.total_salary,
        s.updated_at
      FROM salary s
      JOIN users u ON s.employee_id = u.employee_id
      ORDER BY u.first_name, u.last_name
    `);

    // Insert a record into reports table
    await pool.execute(
      'INSERT INTO reports (report_type, generated_for, generated_by, created_at) VALUES (?, ?, ?, NOW())',
      ['SALARY', 'ALL', hrId]
    );

    res.status(200).json({ 
      report_type: 'SALARY', 
      generated_at: new Date(),
      data: salaryRecords 
    });
  } catch (error) {
    console.error('Error generating salary report:', error);
    res.status(500).json({ message: 'Error generating salary report', error: error.message });
  }
};