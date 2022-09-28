const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  body,
  validationResult,
} = require('express-validator');
const database = require('../database');

require('dotenv')
  .config();

const router = express.Router();

// Register User
router.post(
  '/register',
  body('username')
    .exists({ checkNull: true })
    .isAlphanumeric('en-US')
    .isLength({ min: 3 }),
  body('password')
    .isLength({ min: 8 })
    .isStrongPassword()
    .isAlphanumeric()
    .exists({ checkNull: true }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const isUsernameAvailable = await database.query('select username from users where username=?', [req.body.username]);
    if (isUsernameAvailable.length !== 0) {
      return res.status(409)
        .json({
          result: false,
          error: 'USERNAME ALREADY EXITS',
        });
    }

    const hashed_password = bcrypt.hashSync(req.body.password, 10);
    const rows = await database.query('insert into users (username, password, status) values (?, ?, ?)', [req.body.username, hashed_password, 'ACTIVE']);

    if (rows.affectedRows !== 1) {
      return res.status(500)
        .json({
          result: false,
        });
    }
    return res.status(200)
      .json({
        result: true,
      });
  },
);

// Login User
router.post(
  '/login',
  body('username')
    .exists({ checkNull: true })
    .isAlphanumeric('en-US')
    .isLength({ min: 3 }),
  body('password')
    .isLength({ min: 8 })
    .isAlphanumeric()
    .exists({ checkNull: true }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const user = await database.query('select * from users where username=?', [req.body.username]);

    if (user.length === 0 || !user[0].status || user[0].status !== 'ACTIVE') {
      return res.status(404)
        .json({
          result: false,
          error: 'USER NOT EXITS',
        });
    }

    if (!bcrypt.compareSync(req.body.password, user[0].password)) {
      return res.status(401)
        .json({
          result: false,
          error: 'USERNAME OR PASSWORD WRONG',
        });
    }

    const token = jwt.sign({
      username: req.body.username,
      id: user[0].id,
    }, process.env.JWT_KEY, undefined, undefined);

    return res.json({
      result: true,
      token,
    });
  },
);

module.exports = router;
