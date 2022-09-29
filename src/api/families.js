const express = require('express');
const {
  body,
  validationResult,
} = require('express-validator');
const { authCheck } = require('../middlewares');

const {
  createFamily,
  getFamilies,
  getFamily,
  editFamilyCrowd,
} = require('../controllers/families');

const router = express.Router();

// Create new family
router.post(
  '/',
  authCheck,
  body('name')
    .exists(),
  body('crowd')
    .exists()
    .isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const result = await createFamily(req.user.id, req.body.name, req.body.crowd);

    return res.json({
      result,
    });
  },
);

// Get all families
router.get(
  '/',
  authCheck,
  async (req, res) => {
    const families = await getFamilies(req.user.id);

    return res.json({
      result: true,
      families,
    });
  },
);

// Get a specific family
router.get(
  '/:familyId',
  authCheck,
  async (req, res) => {
    const family = await getFamily(req.user.id, req.params.familyId);

    if (family.length === 0) {
      return res.status(404)
        .json({
          result: false,
        });
    }

    return res.json({
      result: true,
      family: family[0],
    });
  },
);

// Edit crowd of a family by id
router.patch(
  '/:familyId/edit/crowd',
  authCheck,
  body('crowd')
    .exists()
    .isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const result = await editFamilyCrowd(req.user.id, req.params.familyId, req.body.crowd);

    if (!result) {
      return res.status(500)
        .json({
          result: false,
          error: 'INTERNAL SERVER ERROR',
        });
    }

    return res.status(200)
      .json({
        result: true,
      });
  },
);

module.exports = router;
