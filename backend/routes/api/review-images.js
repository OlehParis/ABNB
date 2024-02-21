// backend/routes/api/review-images.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, ReviewImage } = require("../../db/models");

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { imageId } = req.params;

  let reviewByPk = await ReviewImage.findByPk(imageId,{include:Review});
//   console.log(reviewByPk.Review.dataValues.userId);
  if (!reviewByPk) {
    return res.status(404).json({
      "message": "Review Image couldn't be found"
    });
  }
  if (reviewByPk.Review.dataValues.userId !== req.user.dataValues.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await reviewByPk.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});
module.exports = router;
