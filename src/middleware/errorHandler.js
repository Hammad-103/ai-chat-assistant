/**
 * Centralized Error Handling Middleware
 * Must be the last middleware in the app
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`\n❌ Error [${status}]: ${message}`);
  console.error('Stack:', err.stack);

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
