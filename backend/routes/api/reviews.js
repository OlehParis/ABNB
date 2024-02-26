// backend/routes/api/reviews.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  setTokenCookie,
  requireAuth,
  formatDate,
  formatWithTime,
} = require("../../utils/auth");
const {
  Spot,
  User,
  Review,
  ReviewImage,
  SpotImage,
} = require("../../db/models");
let count = 0;

//Get all Reviews of the Current User (requireAuth)
// Returns all the reviews written by the current user.
router.get("/current", requireAuth, async (req, res, next) => {
  let currentUserId = req.user.id;
  if (currentUserId) {
    try {
      let getReview = await Review.findAll({
        where: { userId: currentUserId },
        include: [
          { model: Spot, attributes: { exclude: ["createdAt", "updatedAt"] } },
          { model: User },
          {
            model: ReviewImage,
            attributes: { exclude: ["reviewId", "createdAt", "updatedAt"] },
          },
          {
            model: SpotImage,
          },
        ],
      });
      // res.json(getReview);
      if (getReview.length === 0) {
        return res.json({ Reviews: "You don't have any reviews" });
      }

      const resReviews = getReview.map((review) => {
        const spot = review.Spot;
        return {
          id: review.id,
          userId: review.userId,
          spotId: review.spotId,
          review: review.review,
          stars: review.stars,
          createdAt: formatWithTime(review.createdAt),
          updatedAt: formatWithTime(review.updatedAt),
          User: {
            id: review.User.id,
            firstName: review.User.firstName,
            lastName: review.User.lastName,
          },
          Spot: {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            price: spot.price,
            previewImage: review.SpotImages[0].url,
          },
          ReviewImages: review.ReviewImages.map((image) => ({
            id: image.id,
            url: image.url,
          })),
        };
      });

      return res.json({ Reviews: resReviews });
    } catch (error) {
      return next(error);
    }
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
      message: "Review couldn't be found",
    });
  }
  if (curUserId === review.userId && count <= 9) {
    const newImage = await ReviewImage.create({
      url: url,
      reviewId: reviewId,
    });
    count++;
    console.log(count);
    const { createdAt, updatedAt, ...withOutTime } = newImage.toJSON();

    return res.json(withOutTime);
  }
  return res.status(403).json({
    message: "Maximum number of images for this resource was reached",
  });
});

// Edit a Review (Auth require)
router.put(
  "/:reviewId",
  requireAuth,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const reviewByPk = await Review.findByPk(reviewId);
    if (!reviewByPk) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }
    if (reviewByPk.userId !== req.user.dataValues.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const editReview = await reviewByPk.update({
      review,
      stars,
    });

    return res.status(200).json(editReview);
  },
  handleValidationErrors
);

//Delete a Review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const reviewByPk = await Review.findByPk(reviewId);
  if (!reviewByPk) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }
  if (reviewByPk.userId !== req.user.dataValues.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  await reviewByPk.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});
module.exports = router;
