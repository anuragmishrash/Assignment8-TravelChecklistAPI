const errorHandler = (err, req, res, next) => {
  // Log to console for dev
  console.error(err);

  // Multer errors
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large. Maximum size is 5MB';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Wrong field name for file upload';
    }
    
    return res.status(400).json({
      success: false,
      message
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    return res.status(404).json({
      success: false,
      message
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return res.status(400).json({
      success: false,
      message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};

module.exports = errorHandler; 