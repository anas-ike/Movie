export function validate(schema, target = 'body') {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[target]);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid request'
        }
      });
    }
    req.validated = parsed.data;
    next();
  };
}
