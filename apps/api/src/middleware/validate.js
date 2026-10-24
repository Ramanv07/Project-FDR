export function validate(schema) {
  return (req, res, next) => {
    try {
      if (schema.parse) {
        req.body = schema.parse(req.body);
      }
      next();
    } catch (err) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.errors || err.message,
      });
    }
  };
}
