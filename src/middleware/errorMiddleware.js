// src/middleware/errorMiddleware.js

/**
 * 404 handler – catch any requests to undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found – ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * General error handler – send JSON response with message & optional stack
 */
export const errorHandler = (err, req, res, next) => {
  // If response code is still 200, it's really a server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Only expose stack trace in non-production environments
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
