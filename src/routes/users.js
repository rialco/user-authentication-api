const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');
const { authenticateToken, reauthenticateWithRefresh } = require('../middleware/authorization');

router.get('/:id', authenticateToken, usersController.getUserByID);
router.get('/', authenticateToken, usersController.getAllUsers);
router.get('/auth/refresh_token', reauthenticateWithRefresh, usersController.revalidateToken);

router.post('/login', usersController.loginUser);
router.post('/signup', usersController.createUser);

router.patch('/:id', authenticateToken, usersController.updateUser);

router.delete('/:id', authenticateToken, usersController.deleteUser);

module.exports = router;
