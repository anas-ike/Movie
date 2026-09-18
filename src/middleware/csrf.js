export function requireCsrf(req, res, next) {
  const token = req.body?._csrf || req.headers['x-csrf-token'];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_INVALID',
        message: 'Invalid CSRF token'
      }
    });
  }
  next();
}
