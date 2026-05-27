// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Log the raw error for internal debugging (consider using Winston/Pino in production)
  console.error('[Error Handler]:', err);

  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
  };

  // --------------------------------------------------------
  // PostgreSQL / Supabase Error Code Interception
  // --------------------------------------------------------

  // 23505: Unique Constraint Violation (e.g., duplicate email)
  if (err.code === '23505') {
    customError.message = 'A record with that information already exists.';
    customError.statusCode = 409; // Conflict
  }

  // 23503: Foreign Key Violation (e.g., adding an expense to a non-existent category)
  if (err.code === '23503') {
    customError.message = 'Referenced record does not exist. Please check your inputs.';
    customError.statusCode = 400; // Bad Request
  }

  // 23502: Not Null Violation (e.g., missing a required field)
  if (err.code === '23502') {
    customError.message = 'A required field is missing.';
    customError.statusCode = 400; // Bad Request
  }

  // 22P02: Invalid Text Representation (e.g., passing a string where a UUID is expected)
  if (err.code === '22P02') {
    customError.message = 'Invalid data format provided (e.g., invalid ID).';
    customError.statusCode = 400; // Bad Request
  }

  // 42P01: Undefined Table (Good for catching development typos)
  if (err.code === '42P01') {
    customError.message = 'Database configuration error. Table not found.';
    customError.statusCode = 500; 
  }

  // --------------------------------------------------------
  // Supabase Auth / PostgREST Specific Errors
  // --------------------------------------------------------
  
  // PostgREST JWT expiration or invalid token
  if (err.code === 'PGRST301' || (err.message && err.message.includes('JWT'))) {
    customError.message = 'Your session has expired or is invalid. Please log in again.';
    customError.statusCode = 401; // Unauthorized
  }

  // Send the formatted response to the frontend
  res.status(customError.statusCode).json({
    success: false,
    error: customError.message,
    // Only send raw error details in development mode
    ...(process.env.NODE_ENV === 'development' && { rawDetails: err.details || err.hint || err })
  });
};

module.exports = errorHandler;
