const ApiError = require('../serializers/utils/ApiError');
const UserSerializer = require('../serializers/UserSerializer');
const UserRepo = require('../repo/user-repo');

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (name == null || email == null || password == null) {
      throw new ApiError('No null values accepted', 400);
    }

    if (name === undefined || email === undefined || password === undefined) {
      throw new ApiError('Payload must contain name, email and password', 400);
    }

    // TODO: Implement a string validator
    if (name.trim().length === 0) {
      throw new ApiError('You must submit a valid name', 400);
    }

    if (email.trim().length === 0) {
      throw new ApiError('You must submit a valid email', 400);
    }

    if (password.trim().length === 0) {
      throw new ApiError('You must submit a valid password', 400);
    }

    const user = await UserRepo.insert(null, email, password);

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

const getUserByID = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const user = await UserRepo.findByID(userID);

    if (!user) throw new ApiError('No user found', 400);

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  res.json('User updated');
};

const deleteUser = async (req, res, next) => {
  try {
    const userID = req.params.id;

    const user = await UserRepo.findByID(userID);

    if (!user) throw new ApiError('User not found', 400);

    const deletedUser = await UserRepo.delete(userID);

    res.json(new UserSerializer(deletedUser));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
};
