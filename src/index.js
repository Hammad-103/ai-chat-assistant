const app = require('./app');
const { testConnection, closePool } = require('./config/db');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    console.log('\n🔗 Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('\n⚠️  Warning: Could not connect to database');
      console.error('Make sure PostgreSQL is running and DATABASE_URL is correct in .env');
      console.error('The server will still start, but database operations will fail.');
    }

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 ${process.env.APP_NAME || 'Server'} is running`);
      console.log(`📋 Environment: ${NODE_ENV}`);
      console.log(`🔌 Port: ${PORT}`);
      console.log(`\n✅ Server started successfully\n`);
    });

    const gracefulShutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(async () => {
        console.log('✅ HTTP server closed');
        await closePool();
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('\n❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
