// backend/routes/api/users.js
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

// Get all Spots
router.get("/", async (req, res, next) => {
  const allSpots = await Spot.findAll({
    // include: [User, Review],
  });
  console.log("$$$$$$$$$$$$$$$$$$$$$    Missing avgRating and previewImage");
  return res.json(allSpots);
});

//Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const allSpotsCur = await Spot.findAll({
    where: { ownerId: req.user.dataValues.id },
  });
  // console.log(req.user.dataValues.id)
  console.log("$$$$$$$$$$$$$$$$$$$$$    Missing avgRating and previewImage");
  return res.json(allSpotsCur);
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const deletedSpot = await Spot.findByPk(spotId);
  if (deletedSpot && deletedSpot.ownerId === req.user.dataValues.id) {
    await deletedSpot.destroy();
    return res.json("Successfully deleted");
  }
  return res.status(404).json("Spot couldn't be found");
});

// Get details of a Spot from an id
router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;
  const spotById = await Spot.findByPk(spotId, {
    include: User,
    attributes: { exclude: ["username"] },
  });

  // Check if Spot exists
  if (!spotById) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  return res.json(spotById);
});

//Edit a Spot
//Updates and returns an existing spot.
router.put(
  "/:spotId",
  requireAuth,
  async (req, res, next) => {
    const { spotId } = req.params;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    if (spot.ownerId !== req.user.dataValues.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const editSpot = await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    return res.status(201).json(editSpot);
  },
  handleValidationErrors
);

//Create a Spot (require Auth)
router.post(
  "/",
  requireAuth,
  async (req, res, next) => {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    // Create a new spot in the database associated with the authenticated user
    const newSpot = await Spot.create({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      ownerId: req.user.id,
    });

    // Respond with the newly created spot
    return res.status(201).json(newSpot);
  },
  handleValidationErrors
);

//Add an Image to a Spot based on the Spot's id (Auth require)

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;
  const { spotId } = req.params;
  const curUserId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  if (curUserId === spot.ownerId) {
    const newImage = await SpotImage.create({
      url: url,
      preview: true,
    });
    const { createdAt, updatedAt, ...withOutTime } = newImage.toJSON();
    
    return res.json(withOutTime);
   
  }
  return res.json("Only host can add image");
});

// Get all Reviews by a Spot's id
// Returns all the reviews that belong to a spot specified by id.
router.get("/:spotId/reviews", async (req, res, next) => {
  const { spotId } = req.params;
  let spotReview = await Review.findAll({
    where: {
      spotId: spotId,
    },
    include: [User, ReviewImage],
  });
  if (spotReview.length === 0) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  return res.json(spotReview);
});

//Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  async (req, res, next) => {
    const curUserId = req.user.id;
    const { review, stars } = req.body;
    const { spotId } = req.params;

    //Check if the Spot exists
    const findSpot = await Spot.findByPk(spotId);
    console.log(findSpot);
    if (!findSpot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }
    //Check if Review already exist
    const existingReview = await Review.findOne({
      where: {
        userId: curUserId,
        spotId: spotId,
      },
    });
    if (existingReview) {
      return res.status(500).json({
        message: "User already has a review for this spot",
      });
    }
    // Create the new review
    const newReview = await Review.create({
      userId: curUserId,
      spotId: spotId,
      review: review,
      stars: stars,
    });

    return res.status(201).json(newReview);
  },
  handleValidationErrors
);

module.exports = router;
