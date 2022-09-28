const express = require('express');
const auth = require('./auth');
const families = require('./families');
const trips = require('./trip');
const payments = require('./payments');
const calculator = require('./calculator');

require('dotenv')
  .config();

const router = express.Router();

router.use(auth);
router.use(families);
router.use(trips);
router.use(payments);
router.use(calculator);

module.exports = router;
