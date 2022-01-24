const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

router.get('/:id', usersController.getUserByID);

router.post('/login', usersController.loginUser);
router.post('/signup', usersController.createUser);

router.patch('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;
