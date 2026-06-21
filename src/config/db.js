const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

const query = (text, params) => {
  const start = Date.now();
  return pool.query(text, params).then((result) => {
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  }).catch((error) => {
    console.error('Database query error:', error);
    throw error;
  });
};

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('\n✅ Database connection successful');
    console.log(`📋 Server time: ${result.rows[0].now}`);
    return true;
  } catch (error) {
    console.error('\n❌ Database connection failed:', error.message);
    return false;
  }
};

const getClient = () => pool.connect();

const closePool = async () => {
  await pool.end();
  console.log('\n✅ Database pool closed');
};

module.exports = {
  pool,
  query,
  testConnection,
  getClient,
  closePool,
};
