const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');
const dotenv = require('dotenv');

dotenv.config();

const runMigrations = async () => {
  const client = await pool.connect();
  try {
    console.log('\n🔄 Starting database migrations...');

    const migrationPath = path.join(__dirname, '../database/migrations/001_init_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    await client.query(sql);
    console.log('\n✅ Migration completed successfully');
    console.log('✅ Tables created: users, chat_sessions, messages');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
};

runMigrations();
