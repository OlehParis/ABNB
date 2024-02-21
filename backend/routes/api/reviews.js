// backend/routes/api/reviews.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, ReviewImage } = require("../../db/models");
let count = 0;

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

 
//Add an Image to a Review based on the Review's id (Auth require)
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const { url } = req.body;
  const { reviewId } = req.params;
  const curUserId = req.user.id;
  const review = await Review.findByPk(reviewId);
 
  if (!review) {
    res.status(404).json({
      "message": "Review couldn't be found"
    });
  }
  if (curUserId === review.userId && count <=9) {
    const newImage = await ReviewImage.create({
      url: url
    });
    count++;
    console.log(count)
    const { createdAt, updatedAt, ...withOutTime } = newImage.toJSON();
    
    return res.json(withOutTime);
   
  }
  return res.json({
    "message": "Maximum number of images for this resource was reached"
  });
});



module.exports = router;
