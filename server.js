const express = require('express');
const db = require('./config/db');
const JWT = require('jsonwebtoken');
const JwtConfig = require('./config/jwt-config');
const JwtMiddleware = require('./config/jwt-middleware');

const app = express();

const PORT = 8091;

app.use(express.json({ extended: false }));

db.authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => {
    console.log('Database connect failed ', error);
  });

app.post('/profile', JwtMiddleware.checkToken, (req, res) => {
  res.status(200).json({
    status: 1,
    userdata: req.user
  });
});

app.post('/validate', (req, res) => {
  //   console.log(req.headers['authorization']);

  let userToken = req.headers['authorization'];

  JWT.verify(userToken, JwtConfig.Secret, (error, userData) => {
    if (error) {
      res.status(500).json({
        status: 0,
        message: 'Invalid token'
      });
    } else {
      res.status(200).json({
        status: 1,
        message: 'Validated user',
        userdata: userData
      });
    }
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to Node JS API.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
