const bcrypt = require('bcrypt');

const ApiError = require('../utils/ApiError');
const UserSerializer = require('../serializers/UserSerializer');
const TokenSerializer = require('../serializers/TokenSerializer');
const UserRepo = require('../repo/UserRepo');
const {
  emailValidator, nameValidator, passwordValidator, validateUserRole,
} = require('./utils/validator');
const { generateTokens } = require('./utils/jwt-helper');

/*
  Validates user's request body in order to create it in database
*/
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate no null values in request.
    if (name == null || email == null || password == null) {
      throw new ApiError('No null values accepted', 400);
    }

    // Validate no undefined values in request.
    if (name === undefined || email === undefined || password === undefined) {
      throw new ApiError('Payload must contain name, email and password', 400);
    }

    // Validate the distinct user's values passed
    // through the request body
    if (!emailValidator(email)) throw new ApiError('Not a valid email', 400);

    if (!nameValidator(name)) throw new ApiError('Names must not exceed 12 character limit.', 400);

    if (!passwordValidator(password)) throw new ApiError('Not a valid password. Use 2 uppercase letters, 2 lowercase, 2 numbers and at least 1 special character.', 400);

    // Hash user's password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Try to save user in the database
    const user = await UserRepo.insert(name, email, hashedPassword);

    res.json(new UserSerializer(user));
  } catch (err) {
    if (err.code === '23505') {
      next(new ApiError('Not a valid email', 400));
      return;
    }
    if (err.code === '23502') {
      next(new ApiError('Null values not allowed', 400));
      return;
    }
    next(err);
  }
};

/*
  Get user's information given its ID
*/
const getUserByID = async (req, res, next) => {
  try {
    const userID = req.params.id;
    validateUserRole('onSameUser', req.userSession, userID);

    const user = await UserRepo.findByID(userID);

    if (!user) throw new ApiError('No user found', 400);

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

/*
  Get user's information given its ID
*/
const getAllUsers = async (req, res, next) => {
  try {
    validateUserRole('onOtherUsers', req.userSession);

    const user = await UserRepo.findAll();

    if (!user) throw new ApiError('No users found', 400);

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

/*
  Update user's values through PATCH conventions
  following RFC 6902 standards (Given an operation, value and path)
*/
const updateUser = async (req, res, next) => {
  try {
    const requestingUser = req.userSession;
    const { op, value, path } = req.body;
    if (
      op === undefined
      || op !== 'replace'
      || path === undefined
      || value === undefined
    ) {
      throw new ApiError('Not a valid update', 400);
    }

    const cleanPath = path.replace('/', '');
    if (cleanPath !== 'password' && cleanPath !== 'address' && cleanPath !== 'role' && cleanPath !== 'email') {
      throw new ApiError('Not a valid path', 400);
    }

    if (requestingUser.sub === req.params.id && cleanPath === 'role' && requestingUser.role === 'customer') throw new ApiError('Not authorized', 401);

    validateUserRole('onSameUser', requestingUser, req.params.id);

    const user = await UserRepo.findByID(req.params.id);
    if (!user) throw new ApiError('User not found', 400);

    const updatedUser = await UserRepo.update(req.params.id, value, cleanPath);

    res.json(new UserSerializer(updatedUser));
  } catch (err) {
    next(err);
  }
};

/*
  Delete user's information from database
*/
const deleteUser = async (req, res, next) => {
  try {
    const userID = req.params.id;
    validateUserRole('onSameUser', req.userSession, req.params.id);

    const user = await UserRepo.findByID(userID);

    if (!user) throw new ApiError('User not found', 400);

    const deletedUser = await UserRepo.delete(userID);

    res.json(new UserSerializer(deletedUser));
  } catch (err) {
    next(err);
  }
};

/*
  Check if user's exists and then validate if the
  password passed through the request is the correct password using bcrypt
*/
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserRepo.findByEmail(email);

    if (!user) throw new ApiError('Not a valid user', 400);

    if (await bcrypt.compare(password, user.password) === false) throw new ApiError('Incorrect password', 400);

    const tokens = generateTokens(user.id, user.name, user.email, user.role);

    res.cookie('refreshToken', tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.json(new TokenSerializer(tokens));
  } catch (err) {
    next(err);
  }
};

const revalidateToken = async (req, res, next) => {
  try {
    const userID = req.userSession.sub;
    const user = await UserRepo.findByID(userID);
    const tokens = generateTokens(user.id, user.name, user.email, user.role);

    res.cookie('refreshToken', tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.json(new TokenSerializer(tokens));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
  loginUser,
  revalidateToken,
};
