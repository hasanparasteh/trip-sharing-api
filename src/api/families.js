const express = require('express');
const {
  body,
  validationResult,
} = require('express-validator');
const middlewares = require('../middlewares');
const database = require('../database');

require('dotenv')
  .config();

const router = express.Router();

// Create new family
router.post(
  '/families',
  middlewares.authCheck,
  body('name')
    .exists({ checkNull: true }),
  body('crowd')
    .exists()
    .isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const family = await database.query('insert into families (name, owner, crowd) VALUES (?,?,?)', [req.body.name, req.user.id, req.body.crowd]);

    if (family.affectedRows !== 1) {
      return res.status(500)
        .json({
          result: true,
          error: 'INTERNAL SERVER ERROR',
        });
    }

    return res.json({
      result: true,
      familyId: family.insertId,
    });
  },
);

// Get all families
router.get(
  '/families',
  middlewares.authCheck,
  async (req, res) => {
    const family = await database.query('select id, name, owner, crowd from families where owner=?', [req.user.id]);

    return res.json({
      result: true,
      family,
    });
  },
);

// Get a specific family
router.get(
  '/families/:familyId',
  middlewares.authCheck,
  async (req, res) => {
    const family = await database.query('select id, name, owner, crowd from families where owner=? AND id=?', [req.user.id, req.params.familyId]);

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

// Edit crowd of a family by name
router.patch(
  '/families/edit/crowd',
  middlewares.authCheck,
  body('name')
    .exists(),
  body('crowd')
    .exists({ checkNull: true })
    .isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const family = await database.query('update families set crowd=? where owner=? AND name=?', [req.body.crowd, req.user.id, req.body.name]);

    if (family.affectedRows !== 1) {
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

// Edit crowd of a family by id
router.patch(
  '/families/edit/crowd/:familyId',
  middlewares.authCheck,
  body('crowd')
    .exists({ checkNull: true })
    .isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.mapped() });
    }

    const family = await database.query('update families set crowd=? where owner=? AND name=?', [req.body.crowd, req.user.id, req.params.familyId]);

    if (family.affectedRows !== 1) {
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
