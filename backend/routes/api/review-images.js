// backend/routes/api/review-images.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, ReviewImage } = require("../../db/models");

//Delete Image Review
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const curUserId = req.user.id;
  let reviewByPk = await ReviewImage.findByPk(imageId, { include: Review });

  if (!reviewByPk || curUserId !== reviewByPk.Review.userId) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
    });
  }
  if (reviewByPk.Review.userId !== curUserId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await reviewByPk.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});
module.exports = router;
