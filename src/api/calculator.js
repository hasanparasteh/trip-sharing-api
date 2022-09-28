const express = require('express');
const { authCheck } = require('../middlewares');
const database = require('../database');

const router = express.Router();

router.get(
  '/share/:tripId',
  authCheck,
  async (req, res) => {
    const costSumQuery = await database.query('select SUM(cost) as sum from payments where tripId=? AND owner=?', [req.params.tripId, req.user.id]);
    const crowdSumQuery = await database.query('select SUM(crowd) as sum from families_in_trip left join families family on family.id = families_in_trip.familyId where family.owner=? AND tripId=?', [req.user.id, req.params.tripId]);

    const costSum = costSumQuery[0].sum;
    const crowdSum = crowdSumQuery[0].sum;

    return res.json({
      result: true,
      share: (costSum / crowdSum),
    });
  },
);

module.exports = router;
