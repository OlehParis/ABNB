// backend/routes/api/users.js
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

// Get all Spots
router.get("/", requireAuth,  async (req, res, next)=>{
const allSpots = await Spot.findAll({
    where: { 
      id: 1
    }})
    return res.status(200).json(allSpots)
});

module.exports = router;
