const express = require('express');
const auth = require('./auth');
const families = require('./families');
const trips = require('./trip');
const payments = require('./payments');
const calculator = require('./calculator');

require('dotenv')
  .config();

const router = express.Router();

router.use('/auth', auth);
router.use('/families', families);
router.use('/trips', trips);
router.use('/payments', payments);
router.use('/share', calculator);

module.exports = router;
