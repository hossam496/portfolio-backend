export function errorHandler(err, req, res, next) {
  let status = err.statusCode || err.status || 500;
  let message =
    err.message || (status === 500 ? 'Internal server error' : 'Error');

  if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({ message });
}
