const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'A record with that value already exists' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

module.exports = errorHandler;
