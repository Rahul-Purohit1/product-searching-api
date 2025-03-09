import express from 'express';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[ERROR] ${err.message}`);
  res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fal' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export { errorHandler, AppError };