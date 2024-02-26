// backend/routes/api/users.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
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
  Booking,
} = require("../../db/models");
const e = require("express");
const review = require("../../db/models/review");

// Get all Spots
router.get("/", async (req, res, next) => {
  const allSpots = await Spot.findAll({
    include: [
      {
        model: SpotImage,
      },
      {
        model: Review,
      },
    ],
  });

  const getSpotsRes = allSpots.map((spot) => {
    let totalStars = 0;
    let avgRating = 0;
    console.log(spot);
    if (spot.Reviews && spot.Reviews.length > 0) {
      spot.Reviews.forEach((review) => {
        totalStars += review.stars;
      });
      avgRating = totalStars / spot.Reviews.length;
    }
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: formatWithTime(spot.createdAt),
      updatedAt: formatWithTime(spot.updatedAt),
      avgRating: avgRating,
      previewImage: spot.SpotImages[0].url,
    };
  });

  return res.json({ Spots: getSpotsRes });
});

//Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const allSpots = await Spot.findAll({
    where: { ownerId: req.user.dataValues.id },
    include: [
      {
        model: SpotImage,
      },
      {
        model: Review,
      },
    ],
  });

  const getSpotsRes = allSpots.map((spot) => {
    let totalStars = 0;
    let avgRating = 0;
    console.log(spot);
    if (spot.Reviews && spot.Reviews.length > 0) {
      spot.Reviews.forEach((review) => {
        totalStars += review.stars;
      });
      avgRating = totalStars / spot.Reviews.length;
    }
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: formatWithTime(spot.createdAt),
      updatedAt: formatWithTime(spot.updatedAt),
      avgRating: avgRating,
      previewImage: spot.SpotImages[0].url,
    };
  });

  return res.json({ Spots: getSpotsRes });
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const curUserId = req.user.id;
  const deletedSpot = await Spot.findByPk(spotId);
  if (deletedSpot && deletedSpot.ownerId === curUserId) {
    await deletedSpot.destroy();
    return res.json("Successfully deleted");
  }
  return res.status(404).json("Spot couldn't be found");
});

// Get details of a Spot from an id
router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;
  const allSpots = await Spot.findAll({
    where: { id: spotId },
    include: [
      {
        model: SpotImage,
        attributes: { exclude: ["createdAt", "updatedAt", "spotId"] },
      },
      {
        model: Review,
      },
      {
        model: User,
        attributes: {
          exclude: [
            "username",
            "createdAt",
            "updatedAt",
            "email",
            "hashedPassword",
          ],
        },
      },
    ],
  });

  // Check if Spot exists
  if (allSpots.length === 0) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  // res.json(allSpots);
  const getSpotsRes = allSpots.map((spot) => {
    let totalStars = 0;
    let avgRating = 0;
    console.log(spot);
    if (spot.Reviews && spot.Reviews.length > 0) {
      spot.Reviews.forEach((review) => {
        totalStars += review.stars;
      });
      avgRating = totalStars / spot.Reviews.length;
    }
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: formatWithTime(spot.createdAt),
      updatedAt: formatWithTime(spot.updatedAt),
      avgRating: avgRating,
      SpotImages: spot.SpotImages,
      Owner: spot.User,
    };
  });

  return res.json(getSpotsRes);
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
    let resSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      createdAt: formatWithTime(editSpot.createdAt),
      updateAt: currentTime,
    };

    return res.status(201).json(resSpot);
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
    try {
      const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const resSpot = {
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: formatWithTime(newSpot.createdAt),
        updatedAt: formatWithTime(newSpot.updatedAt),
      };

      return res.status(201).json(resSpot);
    } catch (error) {
      // Handle any errors that occur during spot creation
      return next(error);
    }
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
      preview: preview,
      spotId: spotId,
    });
    const resImage = {
      id: newImage.id,
      url,
      preview,
    };

    return res.json(resImage);
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
  const resReviews = spotReview.map((review) => {
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

      ReviewImages: review.ReviewImages.map((image) => ({
        id: image.id,
        url: image.url,
      })),
    };
  });
  return res.json({ Reviews: resReviews });
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
      if ((s > bs && s < be) || s == bs) {
        conflicts.startDate = "Start date conflicts with an existing booking";
      }
      if ((e > bs && e < be) || e == be) {
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

  // console.log(formattedStartDate);

  // Create new booking
  const newBooking = await Booking.create({
    spotId: spotId,
    userId: curUserId,
    startDate: startDate,
    endDate: endDate,
  });
  const newReturn = {
    spotId: spotId,
    userId: curUserId,
    startDate: startDate,
    endDate: endDate,
  };

  return res.status(200).json(newReturn);
});

//Get all Bookings for a Spot based on the Spot's id (Auth require)
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const curUserId = req.user.id;
  const { spotId } = req.params;

  const allSpots = await Spot.findAll({
    where: { id: spotId },
    attributes: {
      exclude: [
        "city",
        "id",
        "address",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
      ],
    },
    include: [{ model: Booking, include: [User] }],
  });
  // res.json(allSpots[0]);
  if (!allSpots.length) {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  //if you are owner of the spot
  if (curUserId === allSpots[0].ownerId) {
    const ownerBookings = allSpots[0].Bookings.map((booking) => ({
      User: booking.User,
      id: booking.id,
      spotId: spotId,
      userId: booking.userId,
      startDate: formatDate(booking.startDate),
      endDate: formatDate(booking.endDate),
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));
    return res.json({ Bookings: ownerBookings });
  }

  //if you are not owner of the spot
  const notOwnerBookings = allSpots[0].Bookings.map((booking) => ({
    spotId: booking.spotId,
    startDate: formatDate(booking.startDate),
    endDate: formatDate(booking.endDate),
  }));

  return res.json({ Bookings: notOwnerBookings });
});

module.exports = router;
