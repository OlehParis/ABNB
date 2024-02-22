// backend/routes/api/users.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
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
  Booking,
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
      spotId: spotId,
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
    include: [
      {
        model: User,
      },
      {
        model: ReviewImage,
        attributes: { exclude: ["reviewId", "createdAt", "updatedAt"] },
      },
    ],
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

//Create a Booking from a Spot based on the Spot's id

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  try {
    const curUserId = req.user.id;
    const { startDate, endDate } = req.body;
    const { spotId } = req.params;

    // Retrieve spot information along with associated bookings
    const spotByPk = await Spot.findByPk(spotId, {
      include: [Booking],
    });

    if (!spotByPk) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    // Check if the spot belongs to the current user
    if (curUserId === spotByPk.ownerId) {
      return res.json({
        message: "You can't book your own spot",
      });
    }

    const arrBookings = spotByPk.dataValues.Bookings || [];
    let hasConflict = false;
    const conflicts = {};

    for (let booking of arrBookings) {
      const bs = new Date(booking.startDate).getTime();
      const be = new Date(booking.endDate).getTime();
      const s = new Date(startDate).getTime();
      const e = new Date(endDate).getTime();

      // Check for overlap between the existing booking and the new booking
      if ((s < be && e > bs) || (bs < e && be > s)) {
        hasConflict = true;
        if (s > bs && s < be) {
          conflicts.startDate = "Start date conflicts with an existing booking";
        }
        if (e > bs && e < be) {
          conflicts.endDate = "End date conflicts with an existing booking";
        }
      }
    }

    if (hasConflict) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: conflicts,
      });
    }

    // const formattedStartDate = startDate.split("T")[0];
    // const formattedEndDate = endDate.split("T")[0];
    // console.log(formattedStartDate);
    // Create new booking
    const newBooking = await Booking.create({
      spotId: spotId,
      userId: curUserId,
      startDate: startDate,
      endDate: endDate,
    });
    // const newReturn = {
    //   spotId: spotId,
    //   userId: curUserId,
    //   startDate: formattedStartDate,
    //   endDate: formattedEndDate,
    // };
    // const toReturn = newBooking.startDate.toString().split("T")[0]
    return res.status(200).json(newBooking);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
