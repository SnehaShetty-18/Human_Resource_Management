import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Prewal@137',
  database: 'dayflow_hrms',
  connectionLimit: 10,
  waitForConnections: true,
});

// Function to update users table structure
export const updateUsersTable = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Check if joining_year column exists, if not, add it
    try {
      await connection.query("SELECT joining_year FROM users LIMIT 1");
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_FIELD') {
        await connection.query('ALTER TABLE users ADD COLUMN joining_year INT');
        console.log('Added joining_year column to users table');
      }
    }
    
    // Check if joining_serial column exists, if not, add it
    try {
      await connection.query("SELECT joining_serial FROM users LIMIT 1");
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_FIELD') {
        await connection.query('ALTER TABLE users ADD COLUMN joining_serial INT');
        console.log('Added joining_serial column to users table');
      }
    }
    
    // Check if is_temp_password column exists, if not, add it
    try {
      await connection.query("SELECT is_temp_password FROM users LIMIT 1");
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_FIELD') {
        await connection.query('ALTER TABLE users ADD COLUMN is_temp_password BOOLEAN DEFAULT TRUE');
        console.log('Added is_temp_password column to users table');
      }
    }
    
    connection.release();
    console.log('Users table structure verification completed');
  } catch (error) {
    console.error('Error updating users table:', error);
  }
};

export default pool;