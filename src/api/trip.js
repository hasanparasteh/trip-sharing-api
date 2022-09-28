const express = require('express');
const {
  body,
  validationResult,
} = require('express-validator');
const middlewares = require('../middlewares');
const database = require('../database');

const validStatusList = ['STARTED', 'FINISHED', 'INIT'];

require('dotenv')
  .config();

const router = express.Router();

// Get All Trips
router.get('/trips', middlewares.authCheck, async (req, res) => {
  const trips = await database.query('select * from trip where creator=?', [req.user.id]);

  // eslint-disable-next-line no-restricted-syntax
  for await (const trip of trips) {
    const families_in_trip = await database.query('select familyId from families_in_trip where tripId=?', [trip.id]);
    trip.families = families_in_trip.map((family) => family.familyId);
  }

  return res.status(200)
    .json({
      result: true,
      trips,
    });
});

// Add Family INTO trip
router.post('/trips/:tripId/add/:familyId', middlewares.authCheck, async (req, res) => {
  try {
    await database.query('insert into families_in_trip (tripId, familyId, owner) VALUES (?, ?, ?)', [req.params.tripId, req.params.familyId, req.user.id]);

    return res.status(200)
      .json({
        result: true,
        message: `family ${req.params.familyId} added into ${req.params.tripId}`,
      });
  } catch (error) {
    return res.status(500)
      .json({
        result: false,
        error,
      });
  }
});

// Remove Family FROM trip
router.delete('/trips/:tripId/remove/:familyId', middlewares.authCheck, async (req, res) => {
  try {
    await database.query('delete from families_in_trip where tripId=? AND familyId=? AND owner=?', [req.params.tripId, req.params.familyId, req.user.id]);

    return res.status(200)
      .json({
        result: true,
        message: `family ${req.params.familyId} removed from ${req.params.tripId}`,
      });
  } catch (error) {
    return res.status(500)
      .json({
        result: false,
        error,
      });
  }
});

// Update Trip Status
router.put('/trips/:tripId/status/:status', middlewares.authCheck, async (req, res) => {
  if (!req.params.status.includes(validStatusList)) {
    return res.status(400)
      .json({
        result: false,
        error: 'status is not valid only use these status list to update trip status',
        list: validStatusList,
      });
  }

  const updated_trip = await database.query('update trip set status=? where id=?', [req.params.status, req.params.tripId]);

  if (updated_trip.affectedRows !== 1) {
    return res.status(500)
      .json({
        result: false,
        error: 'cant update the trip',
      });
  }

  return res.json({
    result: true,
  });
});

// Create new trip
router.post(
  '/trips',
  middlewares.authCheck,
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

    // eslint-disable-next-line no-restricted-syntax
    for await (const familyId of req.body.members) {
      const isFamilyExists = await database.query('select * from families where id=? and owner=?', [familyId, req.user.id]);
      if (isFamilyExists.length === 0) {
        return res.status(422)
          .json({
            result: false,
            error: `family ${familyId} do not exists`,
          });
      }
    }

    const trips = await database.query('insert into trip (dest, creator) values (?,?)', [req.body.dest, req.user.id]);
    if (trips.affectedRows !== 1) {
      return res.status(500)
        .json({
          result: false,
          error: 'INTERNAL SERVER ERROR',
        });
    }

    // eslint-disable-next-line no-restricted-syntax
    for await (const member of req.body.members) {
      try {
        const relation = await database.query('insert into families_in_trip (tripId, familyId, owner) VALUES (?, ?, ?)', [trips.insertId, member, req.user.id]);
        if (relation.affectedRows !== 1) {
          return res.status(500)
            .json({
              result: false,
              error: 'Did not inserted family_trip relation',
            });
        }
      } catch (error) {
        return res.status(500)
          .json({
            result: false,
            error,
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
