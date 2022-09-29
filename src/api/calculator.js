const express = require('express');
const { authCheck } = require('../middlewares');
const { shareOfEachFamily, shareOfEachPerson, debtOfEachFamily } = require('../controllers/calculator');

const router = express.Router();

router.get(
  '/trip/:tripId',
  authCheck,
  async (req, res) => {
    const share = await shareOfEachPerson(req.user.id, req.params.tripId);

    return res.json({
      result: true,
      share,
    });
  },
);

router.get(
  '/trip/:tripId/family/:familyId',
  authCheck,
  async (req, res) => {
    const shareOfFamily = await shareOfEachFamily(
      req.user.id,
      req.params.tripId,
      req.params.familyId,
    );

    return res.json({
      result: true,
      share: shareOfFamily,
    });
  },
);

router.get(
  '/debt/trip/:tripId/family/:familyId',
  authCheck,
  async (req, res) => {
    const debt = await debtOfEachFamily(
      req.user.id,
      req.params.tripId,
      req.params.familyId,
    );

    return res.json({
      result: true,
      debt,
    });
  },
);

module.exports = router;
