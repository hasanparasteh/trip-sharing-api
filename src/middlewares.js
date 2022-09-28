const jwt = require('jsonwebtoken');
require('dotenv')
  .config();

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

function authCheck(req, res, next) {
  if (!('authorization' in req.headers) || !req.headers.authorization) {
    return res.status(401)
      .json({
        result: false,
        error: 'NOT AUTHORIZED',
      });
  }

  const token = req.headers.authorization.split('Bearer ')[1];

  if (token.length === 0) {
    return res.status(401)
      .json({
        result: false,
        error: 'NOT AUTHORIZED',
      });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_KEY, undefined, undefined);
    const tokenIAT = new Date(req.user.iat * 1000).getTime();
    const validUntil = new Date(new Date(tokenIAT).getTime() + 60 * 60 * 24 * 1000).getTime();
    if (tokenIAT > validUntil) {
      return res.status(401)
        .json({
          result: false,
          error: 'TOKEN INVALIDATED BY TIME',
        });
    }
    return next();
  } catch (error) {
    return res.status(401)
      .json({
        result: false,
        error: 'NOT AUTHORIZED',
      });
  }
}

module.exports = {
  notFound,
  errorHandler,
  authCheck,
};
