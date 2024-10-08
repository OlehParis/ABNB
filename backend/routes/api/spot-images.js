// backend/routes/api/spot-images.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Spot,
  User,
  Review,
  ReviewImage,
  SpotImage,
} = require("../../db/models");
//findByPK((imageId, { include: [Spot] }));

//Delete a Spot Image (require Auth)
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const curUserId = req.user.id;
  let imageByPk = await SpotImage.findAll({
    where: { id: imageId },
    include: [Spot],
  });

  if (imageByPk.length === 0) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }

  if (imageByPk[0].Spot.ownerId !== curUserId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await imageByPk[0].destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});


module.exports = router;
