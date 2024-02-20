// backend/routes/api/reviews.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, ReviewImage } = require("../../db/models");

//Get all Reviews of the Current User (requireAuth)
// Returns all the reviews written by the current user.
router.get("/current", requireAuth, async (req, res, next) => {
  let currentUserId = req.user.id;
  if (currentUserId) {
    let getReview = await Review.findAll({
      where: { userId: currentUserId },
      include: [Spot, User, ReviewImage],
    });
    if (getReview.length === 0) {
      getReview = "you don`t have any reviews";
    }
    // console.log(req.user.id === getReview[0].id)
    return res.json(getReview);
  }
});




module.exports = router;
