const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { request } = require('express');
const passport = require('passport');

require('../models/Users');
const User = mongoose.model('users');

module.exports = {
  login: (req, resp) => {
    resp.render('users/login');
  },

  register: (req, resp) => {
    resp.render('users/register');
  },

  createUser: (req, resp) => {
    let errors = [];
    if (req.body.password.length < 5) {
      errors.push({ text: `Password must be at least 5 chars long.` });
    }

    if (errors.length == 0 && req.body.password !== req.body.confirmPassword) {
      errors.push({ text: `Password does not match.` });
    }

    // ADD A CHECK FOR DUPLICATE EMAIL IDS
    if (errors.length == 0) {
      User.findOne({ email: req.body.email }).
        then((user) => {
          if (user) {
            errors.push({ text: 'The email id is already taken!' });
            console.log('registration errors at email check:', errors);
            resp.render('users/register', {
              errors: errors,
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              confirmPassword: req.body.confirmPassword
            });
          }
          else {
            let userData = {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            }
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(userData.password, salt, (err, hash) => {
                userData.password = hash;
                new User(userData).save()
                  .then((newUser) => {
                    req.flash('success_msg', "You have been registered, you can login now.");
                    resp.redirect('/users/login');
                  })
                  .catch((error) => {
                    console.log('registration error: ', error);
                    req.flash('error_msg', "Something went, please try again.");
                    return;
                  })
              })
            });
          }
        })
    }
    else {
      console.log('registration errors: at else', errors);
      resp.render('users/register', {
        errors: errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      })
    }
  },

  authenticate: (req, resp, next) => {
    passport.authenticate('local', {
      successRedirect: '/ideas',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, resp, next);
  },

  logout: (req, resp, next) => {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        else {
          req.flash('success_msg', 'You are successfully logged out!');
          resp.redirect('/');
        }
      });

  }
}