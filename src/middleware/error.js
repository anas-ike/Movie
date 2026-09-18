import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).render('404', {
    pageTitle: 'Nothing here'
  });
}

export function errorHandler(err, req, res, next) {
  logger.error('request_error', {
    path: req.path,
    method: req.method,
    error: err.message
  });

  if (req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      success: false,
      error: {
        code: err.code || 'SERVER_ERROR',
        message: err.status === 400 ? err.message : 'Something went wrong'
      }
    });
  }

  res.status(err.status || 500).render('500', {
    pageTitle: 'Something went wrong',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong.'
  });
}
