const express = require('express');
const {
  body,
  validationResult,
} = require('express-validator');
const { authCheck } = require('../middlewares');
const {
  getAllTrips,
  addFamilyToTrip,
  removeFamilyFromTrip,
  TripStatuses,
  updateTripStatus,
  isFamiliesExists,
  createTrip,
} = require('../controllers/trips');

const router = express.Router();

// Get All Trips
router.get(
  '/',
  authCheck,
  async (req, res) => {
    const trips = await getAllTrips(req.user.id);

    return res.status(200)
      .json({
        result: true,
        trips,
      });
  },
);

// Add Family INTO trip
router.post(
  '/:tripId/add/:familyId',
  authCheck,
  async (req, res) => {
    const result = await addFamilyToTrip(req.user.id, req.params.tripId, req.params.familyId);

    return res.status(200)
      .json({
        result,
      });
  },
);

// Remove Family FROM trip
router.delete(
  '/:tripId/remove/:familyId',
  authCheck,
  async (req, res) => {
    const result = await removeFamilyFromTrip(req.user.id, req.params.tripId, req.params.familyId);

    return res.status(200)
      .json({
        result,
      });
  },
);

// Update Trip Status
router.put(
  '/:tripId/status/:status',
  authCheck,
  async (req, res) => {
    if (!req.params.status.includes(TripStatuses)) {
      return res.status(400)
        .json({
          result: false,
          error: 'status is not valid only use these status list to update trip status',
          list: TripStatuses,
        });
    }

    const result = updateTripStatus(req.params.status, req.user.id);

    return res.json({
      result,
    });
  },
);

// Create new trip
router.post(
  '/',
  authCheck,
  body('dest')
    .exists()
    .isAlpha(),
  body('members')
    .exists()
    .isArray(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const isAllFamiliesExists = await isFamiliesExists(req.user.id, req.body.members);
    if (!isAllFamiliesExists) {
      return res.status(422).json({
        result: false,
        error: 'one or more familyId is not valid',
      });
    }

    const [createTripResult, tripId] = await createTrip(req.user.id, req.body.dest);
    if (!createTripResult) {
      return res.status(500)
        .json({
          result: false,
          error: 'INTERNAL SERVER ERROR',
        });
    }

    // eslint-disable-next-line no-restricted-syntax
    for await (const member of req.body.members) {
      const result = await addFamilyToTrip(req.user.id, tripId, member);
      if (!result) {
        return res.status(500)
          .json({
            result: false,
            error: 'Did not inserted family_trip relation',
          });
      }
    }

    return res.status(200)
      .json({
        result: true,
      });
  },
);

module.exports = router;
