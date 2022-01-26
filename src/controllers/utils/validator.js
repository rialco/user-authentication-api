const ApiError = require('../../utils/ApiError');

const emailValidator = (email) => {
  const reg = /^([a-z\d]+[.\-_]?[a-z\d]+)@([a-z]+)\.([a-z]+)$/i;

  const valid = reg.test(email);

  return valid;
};

const nameValidator = (name) => {
  const reg = /^([a-z]{2,12})$/i;

  const valid = reg.test(name);

  return valid;
};

const passwordValidator = (pass) => {
  const reg = /^[^+*?^$.#@!`~%&_\n[\]\-\\](?=.*[a-z]){2,}(?=.*[A-Z]){2,}(?=.*\d){2,}(?=.*[+*?^$.#@!%&_])[a-zA-Z\d+*?^$.#@!%&_]{7,}$/;

  const valid = reg.test(pass);

  return valid;
};

const validateUserRole = (reqType, source, destiny) => {
  const requestingUser = source;
  const userID = destiny;
  if (reqType === 'onSameUser' && userID) {
    if (requestingUser.role !== 'staff' && userID !== requestingUser.sub) throw new ApiError('Unathorized access', 401);
  }

  if (reqType === 'onOtherUsers') {
    if (requestingUser.role === 'customer') throw new ApiError('Unathorized access', 401);
  }
};

module.exports = {
  emailValidator,
  nameValidator,
  passwordValidator,
  validateUserRole,
};
