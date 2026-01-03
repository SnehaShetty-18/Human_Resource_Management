import pool from './db.js';
import { verifyToken } from './middleware.js';
import { requireHR } from './middleware.js';

// Set or update salary for an employee (HR/Admin only)
export const setSalary = async (req, res) => {
  try {
    const { employee_id, base_salary, hra, allowances, deductions } = req.body;

    // Validate required fields
    if (!employee_id || base_salary === undefined || hra === undefined || 
        allowances === undefined || deductions === undefined) {
      return res.status(400).json({ 
        message: 'All fields are required: employee_id, base_salary, hra, allowances, deductions' 
      });
    }

    // Calculate total salary
    const total_salary = parseFloat(base_salary) + parseFloat(hra) + parseFloat(allowances) - parseFloat(deductions);

    // Check if salary record already exists for this employee
    const [existingSalary] = await pool.execute(
      'SELECT id FROM salary WHERE employee_id = ?',
      [employee_id]
    );

    if (existingSalary.length > 0) {
      // Update existing salary record
      await pool.execute(
        `UPDATE salary 
         SET base_salary = ?, hra = ?, allowances = ?, deductions = ?, total_salary = ?, updated_at = NOW() 
         WHERE employee_id = ?`,
        [base_salary, hra, allowances, deductions, total_salary, employee_id]
      );
      res.status(200).json({ message: 'Salary updated successfully' });
    } else {
      // Insert new salary record
      await pool.execute(
        `INSERT INTO salary (employee_id, base_salary, hra, allowances, deductions, total_salary, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [employee_id, base_salary, hra, allowances, deductions, total_salary]
      );
      res.status(201).json({ message: 'Salary created successfully' });
    }
  } catch (error) {
    console.error('Error setting salary:', error);
    res.status(500).json({ message: 'Error setting salary', error: error.message });
  }
};

// View my salary (Employee only)
export const viewMySalary = async (req, res) => {
  try {
    const employeeId = req.user.employee_id; // Extracted from JWT

    // Get salary data for the employee
    const [salaryRecord] = await pool.execute(
      `SELECT employee_id, base_salary, hra, allowances, deductions, total_salary, updated_at 
       FROM salary 
       WHERE employee_id = ?`,
      [employeeId]
    );

    if (salaryRecord.length === 0) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.status(200).json({ salary: salaryRecord[0] });
  } catch (error) {
    console.error('Error fetching salary:', error);
    res.status(500).json({ message: 'Error fetching salary', error: error.message });
  }
};

// View all salaries (HR/Admin only)
export const viewAllSalaries = async (req, res) => {
  try {
    // Get salary data joined with users table
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

    res.status(200).json({ salaries: salaryRecords });
  } catch (error) {
    console.error('Error fetching all salaries:', error);
    res.status(500).json({ message: 'Error fetching all salaries', error: error.message });
  }
};