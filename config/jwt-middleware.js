const JWT = require('jsonwebtoken');
const JwtConfig = require('./jwt-config');

let checkToken = (req, res, next) => {
  let userToken = req.headers['authorization'];

  JWT.verify(userToken, JwtConfig.Secret, (error, data) => {
    if (error) {
      return res.status(500).json({
        status: 0,
        message: 'Invalid token'
      });
    } else {
      (req.user = data), next();
    }
  });
};

module.exports = {
  checkToken: checkToken
};
