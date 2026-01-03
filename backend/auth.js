import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';

// Function to generate a random temporary password
const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Function to create a new employee
export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, role_id, department_id, joining_year } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !role_id || !department_id || !joining_year) {
      return res.status(400).json({ message: 'All fields are required: firstName, lastName, email, role_id, department_id, joining_year' });
    }

    // Fetch company code from company table
    const [companyResult] = await pool.execute('SELECT code FROM company LIMIT 1');
    if (companyResult.length === 0) {
      return res.status(500).json({ message: 'Company code not found' });
    }
    const companyCode = companyResult[0].code;

    // Find the max joining_serial for the given year
    const [maxSerialResult] = await pool.execute(
      'SELECT MAX(joining_serial) as max_serial FROM users WHERE joining_year = ?',
      [joining_year]
    );
    let nextSerial = 1;
    if (maxSerialResult[0].max_serial) {
      nextSerial = maxSerialResult[0].max_serial + 1;
    }

    // Generate employee ID
    const first2LettersFirstName = firstName.substring(0, 2).toUpperCase();
    const first2LettersLastName = lastName.substring(0, 2).toUpperCase();
    const employeeId = `${companyCode}${first2LettersFirstName}${first2LettersLastName}${joining_year}${String(nextSerial).padStart(3, '0')}`;

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

    // Insert employee into users table
    await pool.execute(
      `INSERT INTO users (employee_id, first_name, last_name, email, password, role_id, department_id, joining_year, joining_serial, is_temp_password) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employeeId, firstName, lastName, email, hashedPassword, role_id, department_id, joining_year, nextSerial, true]
    );

    // Return employee ID and temporary password
    res.status(201).json({
      employee_id: employeeId,
      temporary_password: tempPassword
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
};

// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Fetch user by email
    const [userResult] = await pool.execute(
      'SELECT employee_id, email, password, role_id, is_temp_password, is_active FROM users WHERE email = ?',
      [email]
    );

    if (userResult.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult[0];

    // Check if the account is deactivated
    if (user.is_active === 0 || user.is_active === false) {
      return res.status(401).json({ message: 'Account is deactivated. Contact HR.' });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT with employee_id and role_id
    const token = jwt.sign(
      { 
        employee_id: user.employee_id,
        role_id: user.role_id
      },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    // Determine if user needs to change password
    const forcePasswordChange = user.is_temp_password;

    // Fetch role name for response (assuming there's a roles table)
    let role = 'user'; // default
    try {
      const [roleResult] = await pool.execute(
        'SELECT role_name FROM roles WHERE id = ?',
        [user.role_id]
      );
      if (roleResult.length > 0) {
        role = roleResult[0].role_name;
      }
    } catch (error) {
      console.error('Error fetching role name:', error);
    }

    // Return appropriate response based on temp password status
    res.status(200).json({
      token,
      forcePasswordChange,
      role
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Change password function
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.employee_id; // From token

    // Validate required fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required' });
    }

    // Fetch user by employee_id
    const [userResult] = await pool.execute(
      'SELECT employee_id, password FROM users WHERE employee_id = ?',
      [userId]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult[0];

    // Compare oldPassword with stored password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash newPassword
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update users table with new password and set is_temp_password to false
    await pool.execute(
      'UPDATE users SET password = ?, is_temp_password = ? WHERE employee_id = ?',
      [hashedNewPassword, false, userId]
    );

    res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// Deactivate employee function
export const deactivateEmployee = async (req, res) => {
  try {
    const { employee_id } = req.body;

    // Validate required fields
    if (!employee_id) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Check if the employee exists
    const [userResult] = await pool.execute(
      'SELECT employee_id FROM users WHERE employee_id = ?',
      [employee_id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Set is_active to false (deactivate the employee)
    await pool.execute(
      'UPDATE users SET is_active = ? WHERE employee_id = ?',
      [false, employee_id]
    );

    res.status(200).json({ message: 'Employee deactivated successfully' });

  } catch (error) {
    console.error('Error deactivating employee:', error);
    res.status(500).json({ message: 'Error deactivating employee', error: error.message });
  }
};