const express = require('express');
const {
  body,
  validationResult,
} = require('express-validator');

const {
  getUser,
  isPasswordValid,
  createToken,
  hashPassword,
  createUser,
  isUserExists,
} = require('../controllers/auth');

require('dotenv').config();

const router = express.Router();

// Register User
router.post(
  '/register',
  body('username')
    .exists()
    .isAlphanumeric('en-US')
    .isLength({ min: 3 }),
  body('password')
    .exists()
    .isStrongPassword({ minLength: 8, minUppercase: 1, minLowercase: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    if (await isUserExists(req.body.username)) {
      return res.status(409)
        .json({
          result: false,
          error: 'USERNAME ALREADY EXITS',
        });
    }

    const result = await createUser(req.body.username, await hashPassword(req.body.password));

    if (!result) {
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
    .isAlphanumeric('en-US')
    .isLength({ min: 3 })
    .exists(),
  body('password')
    .exists()
    .isStrongPassword({ minLength: 8, minUppercase: 1, minLowercase: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const user = await getUser(req.body.username);

    if (!user) {
      return res.status(404)
        .json({
          result: false,
          error: 'USER NOT EXITS',
        });
    }


    if (!isPasswordValid(req.body.password, user[0].password)) {
      return res.status(401).json({
        result: false,
        error: 'username or password wrong',
      });
    }

    const token = await createToken({
      username: req.body.username,
      id: user[0].id,
    }, process.env.JWT_KEY);

    return res.json({
      result: true,
      token,
    });
  },
);

module.exports = router;
