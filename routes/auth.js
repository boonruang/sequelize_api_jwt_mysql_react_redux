const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const JWT = require('jsonwebtoken');
const JwtConfig = require('../config/jwt-config');
const JwtMiddleware = require('../config/jwt-middleware');
const User = require('../models/User');

//  @route          GET api/auth
//  @desc           Get Logged in user
//  @access         Private
router.get('/', JwtMiddleware.checkToken, async (req, res) => {
  //
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id
      },
      // attributes: ['id', 'name', 'email', 'date']
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: 'Server Error'
    });
  }
});

//  @route          POST api/auth
//  @desc           Post authentication & get token
//  @access         Public
router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (user) {
      // user exists
      if (bcrypt.compareSync(req.body.password, user.password)) {
        let userToken = await JWT.sign(
          {
            id: user.id,
            email: user.email
          },
          JwtConfig.Secret,
          {
            expiresIn: JwtConfig.expiresIn
          }
        );

        res.status(200).json({
          status: 1,
          message: 'User logged in successfully',
          token: userToken
        });
      } else {
        res.status(500).json({
          status: 0,
          message: 'Invalid Credentials'
        });
      }
    } else {
      // no user
      res.status(500).json({
        status: 0,
        message: 'Login failed no user'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: 'Server error'
    });
  }
});

module.exports = router;
