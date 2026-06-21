const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');
const dotenv = require('dotenv');

dotenv.config();

const rollback = async () => {
  const client = await pool.connect();
  try {
    console.log('\n🔄 Starting rollback...');

    await client.query('DROP TABLE IF EXISTS messages CASCADE');
    console.log('✅ Dropped messages table');

    await client.query('DROP TABLE IF EXISTS chat_sessions CASCADE');
    console.log('✅ Dropped chat_sessions table');

    await client.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('✅ Dropped users table');

    console.log('\n✅ Rollback completed successfully');

  } catch (error) {
    console.error('\n❌ Rollback failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
};

rollback();
