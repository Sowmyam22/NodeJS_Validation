const express = require('express');

const { check, body } = require('express-validator/check');

const User = require('../models/user');

const {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.post('/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email!')
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } })
          .then(user => {
            if (!user) {
              return Promise.reject(
                'Please enter a valid Email Id!'
              )
            }
          })
      })
      .normalizeEmail(),   // sanitizing the user input: converts all the uppercase to lowercase
    body('password', 'Please enter a valid password!')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  postLogin
);

router.post('/signup',
  [  //groups all the checks
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email!!')
      .custom((value, { req }) => {                               // custom validator
        return User.findOne({ where: { email: value } })
          .then(user => {
            if (user) {
              return Promise.reject('Email Already Exists! Please enter unique Email ID!')   //async validation
            }
          })
      })
      .normalizeEmail(),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(), // to trim excess whitespace
    body('confirmPassword')
      .trim() //custom validator to match password and confirm password
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!!!');
        }
        return true;
      })
  ],
  postSignup
);

router.post('/logout', postLogout);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);

router.post('/new-password', postNewPassword);

module.exports = router;