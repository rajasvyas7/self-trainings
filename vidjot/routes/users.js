const express = require('express');

const UserController =  require('../conrtrollers/UsersController');

const router = express.Router();

router.get('/login', (req, resp) => {
  UserController.login(req, resp);
});

router.get('/register', (req, resp) => {
  UserController.register(req, resp);
});

router.post('/register', (req, resp) => {
  UserController.createUser(req, resp);
});

module.exports = router;
