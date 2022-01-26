const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const pathToAccess = path.join(__dirname, '../../../keys/access_rsa_priv.pem');
const pathToRefresh = path.join(__dirname, '../../../keys/refresh_rsa_priv.pem');

const ACCESS_PRIV_KEY = fs.readFileSync(pathToAccess, 'utf8');
const REFRESH_PRIV_KEY = fs.readFileSync(pathToRefresh, 'utf8');

const generateTokens = (id, _name, _email, _role) => {
  const accessExpiresIn = '15m'; // 15 minutes
  const refreshExpiresIn = '7d'; // 7 days

  const payload = {
    sub: id,
    iat: Date.now(),
    name: _name,
    email: _email,
    role: _role,
  };

  const signedAccess = jwt.sign(payload, ACCESS_PRIV_KEY, { expiresIn: accessExpiresIn, algorithm: 'RS256' });
  const signedRefresh = jwt.sign(payload, REFRESH_PRIV_KEY, { expiresIn: refreshExpiresIn, algorithm: 'RS256' });

  return { accessToken: signedAccess, refreshToken: signedRefresh };
};

module.exports = {
  generateTokens,
};
