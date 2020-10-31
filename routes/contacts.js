const express = require('express');
const router = express.Router();
const Contact = require('../models/Contacts');
const User = require('../models/User');
const JwtMiddleware = require('../config/jwt-middleware');

//  @route              POST contacts
//  @desc               Add contact
//  @access             Private
router.post('/', JwtMiddleware.checkToken, async (req, res) => {
  try {
    const contact = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      type: req.body.type,
      userId: req.user.id
    });
    res.status(200).json(contact);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//  @route              GET contacts
//  @desc               Get contacts
//  @access             Private
router.get('/', JwtMiddleware.checkToken, async (req, res) => {
  // console.log('req.headers', req.headers);
  try {
    const contacts = await Contact.findAll({
      where: {
        userId: req.user.id
        // userId: 1
      }
    });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error
    });
  }
});

//  @route              UPDATE contacts/:id
//  @desc               Update contacts
//  @access             Private
router.put('/:id', JwtMiddleware.checkToken, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      where: {
        id: req.params.id
      }
    });

    // make sure user owns contact
    if (contact.userId === req.user.id) {
      const response = await Contact.update(
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          type: req.body.type,
          userId: req.user.id
        },
        {
          where: {
            id: req.params.id
          }
        }
      );

      const result = await Contact.findOne({
        where: {
          id: req.params.id
        }
      });

      res.status(200).json(result);
    } else {
      res.status(500).json({
        status: 0,
        message: 'Not authorized'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error
    });
  }
});

//  @route              DELETE contacts/:id
//  @desc               Delete contacts
//  @access             Private
router.delete('/:id', JwtMiddleware.checkToken, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      where: {
        id: req.params.id
      }
    });
    // Make sure user owns contact
    if (contact.userId === req.user.id) {
      const response = await Contact.destroy({
        where: {
          id: req.params.id
        }
      });
      if (response) {
        res.status(200).json({
          status: 1,
          message: 'Contact deleted'
        });
      } else {
        res.status(500).json({
          status: 0,
          error: error
        });
      }
    } else {
      res.status(500).json({
        status: 0,
        message: 'Not authorized'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: 'Contact not found'
    });
  }
});

module.exports = router;
