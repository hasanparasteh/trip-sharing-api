const express = require('express');
const {
  body,
  validationResult,
} = require('express-validator');
const { authCheck } = require('../middlewares');
const database = require('../database');

const router = express.Router();

// Get All Payments
router.get(
  '/payments',
  authCheck,
  async (req, res) => {
    const payments = await database.query('select * from payments where owner=?', [req.user.id]);

    return res.json({
      result: 200,
      payments,
    });
  },
);

// Get All Payments By FamilyId
router.get(
  '/payments/family/:familyId',
  authCheck,
  async (req, res) => {
    const payments = await database.query('select * from payments where owner=? AND familyId=?', [req.user.id, req.params.familyId]);

    return res.json({
      result: 200,
      payments,
    });
  },
);

// Get All Payments By tripId
router.get(
  '/payments/trip/:tripId',
  authCheck,
  async (req, res) => {
    const payments = await database.query('select * from payments where owner=? AND tripId=?', [req.user.id, req.params.tripId]);

    return res.json({
      result: 200,
      payments,
    });
  },
);

// Get All Payments By tripId and familyId
router.get(
  '/payments/trip/:tripId/family/:familyId',
  authCheck,
  async (req, res) => {
    const payments = await database.query('select * from payments where owner=? AND tripId=? AND familyId=?', [req.user.id, req.params.tripId, req.params.familyId]);

    return res.json({
      result: 200,
      payments,
    });
  },
);

// Create a payment
router.post(
  '/payments',
  authCheck,
  body('description')
    .optional()
    .isString(),
  body(['tripId', 'familyId', 'cost'])
    .exists()
    .isNumeric(),
  body('timestamp')
    .optional()
    .isDate({ strictMode: true }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const payments = await database.query('insert into payments (description, cost, familyId, tripId, owner, timestamp) VALUES (?,?,?,?,?,?)', [req.body.description ? req.body.description : null, req.body.cost, req.body.familyId, req.body.tripId, req.user.id, req.body.timestamp ? req.body.timestamp : new Date()]);

    if (payments.affectedRows !== 1) {
      return res.status(500)
        .json({
          result: false,
          error: 'INTERNAL SERVER ERROR',
        });
    }

    return res.json({
      result: true,
    });
  },
);

module.exports = router;
