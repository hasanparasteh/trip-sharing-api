const express = require('express');
const {
  body,
  validationResult,
} = require('express-validator');
const { authCheck } = require('../middlewares');
const {
  getAllPayments,
  getFamilyPayments,
  getTripPayments,
  getPaymentsOfEachFamilyInTrip,
  createPayment,
} = require('../controllers/payments');

const router = express.Router();

// Get All Payments
router.get(
  '/',
  authCheck,
  async (req, res) => {
    const payments = await getAllPayments(req.user.id);

    return res.json({
      result: 200,
      payments,
    });
  },
);

// Get All Payments By FamilyId
router.get(
  '/family/:familyId',
  authCheck,
  async (req, res) => {
    const payments = await getFamilyPayments(req.user.id, req.params.familyId);

    return res.json({
      result: 200,
      payments,
    });
  },
);

// Get All Payments By tripId
router.get(
  '/trip/:tripId',
  authCheck,
  async (req, res) => {
    const payments = await getTripPayments(req.user.id, req.params.tripId);

    return res.json({
      result: 200,
      payments,
    });
  },
);

// Get All Payments By tripId and familyId
router.get(
  '/trip/:tripId/family/:familyId',
  authCheck,
  async (req, res) => {
    const payments = await getPaymentsOfEachFamilyInTrip(
      req.user.id,
      req.params.tripId,
      req.params.familyId,
    );

    return res.json({
      result: 200,
      payments,
    });
  },
);

// Create a payment
router.post(
  '/',
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

    const payment = await createPayment(
      req.user.id,
      req.body.tripId,
      req.body.familyId,
      req.body.cost,
      req.body.timestamp,
      req.body.description,
    );

    return res.json({
      result: payment,
    });
  },
);

module.exports = router;
