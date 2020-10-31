const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

//  @route          POST api/users
//  @desc           Register user
//  @access         Public
router.post('/', async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, 10);

  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (user) {
      // email user exists
      res.status(500).json({
        status: 0,
        message: 'Email already exists'
      });
    } else {
      // no email user;
      await User.create({
        name: name,
        email: email,
        password: password
      });

      res.status(200).json({
        status: 1,
        message: 'Registerd user'
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
