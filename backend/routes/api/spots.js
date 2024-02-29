// backend/routes/api/users.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
const { check, query } = require("express-validator");
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

const handleValidateQuery = [
  query("page")
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1")
    .optional(),
  query("page")
    .isInt({ max: 10 })
    .withMessage("Page must be less than or equal to 10")
    .optional(),
  query("size")
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1")
    .optional(),
  query("size")
    .isInt({ max: 20 })
    .withMessage("Size must be less than or equal to 20")
    .optional(),
  query("minLat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude must be -90 or greater")
    .bail()
    .custom(async (min, { req }) => {
      const max = req.query.maxLat;
      if (Number.parseFloat(min) > Number.parseFloat(max)) {
        throw new Error(
          "Minimum latitude cannot be greater than maximum latitude"
        );
      }
    })
    .optional(),
  query("maxLat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude must be equal to or less than 90")
    .bail()
    .custom(async (max, { req }) => {
      const min = req.query.minLat;
      if (Number.parseFloat(max) < Number.parseFloat(min)) {
        throw new Error(
          "Maximum latitude cannot be less than minimum latitude"
        );
      }
    })
    .optional(),
  query("minLng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude must be -180 or greater")
    .bail()
    .custom(async (min, { req }) => {
      const max = req.query.maxLng;
      if (Number.parseFloat(min) > Number.parseFloat(max)) {
        throw new Error(
          "Minimum longitude cannot be greater than maximum longitude"
        );
      }
    })
    .optional(),
  query("maxLng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude must be 180 or less")
    .bail()
    .custom(async (max, { req }) => {
      const min = req.query.minLng;
      if (Number.parseFloat(max) < Number.parseFloat(min)) {
        throw new Error(
          "Maximum longitude cannot be less than minimum longitude"
        );
      }
    })
    .optional(),
  query("minPrice")
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0")
    .bail()
    .custom(async (min, { req }) => {
      const max = req.query.maxPrice;
      if (Number.parseFloat(min) > Number.parseFloat(max)) {
        throw new Error("Minimum price cannot be greater than maximum price");
      }
    })
    .optional(),
  query("maxPrice")
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0")
    .bail()
    .custom(async (max, { req }) => {
      const min = req.query.minPrice;
      if (Number.parseFloat(max) < Number.parseFloat(min)) {
        throw new Error("Maximum price cannot be less than minimum price");
      }
    })
    .optional(),
  handleValidationErrors,
];

// Get all Spots
router.get("/", handleValidateQuery, async (req, res) => {
  let { page, size, maxLat, minLat, minLng, maxLng } = req.query;
  let minPrice = req.query.minPrice;
  let maxPrice = req.query.maxPrice;
  page = parseInt(page) || 1;
  size = parseInt(size) || 20;

  let limit = size;
  let offset = size * (page - 1);

  const options = {
    include: [
      { model: Review },
      { model: SpotImage, where: { preview: true }, required: false },
    ],
    where: {},
    limit,
    offset,
  };

  if (minLat) {
    options.where.lat = { [Op.gte]: minLat };
  }
  if (maxLat) {
    options.where.lat = { [Op.lte]: maxLat };
  }
  if (minLng) {
    options.where.lng = { [Op.gte]: minLng };
  }
  if (maxLng) {
    options.where.lng = { [Op.lte]: maxLng };
  }
  if (minPrice) {
    options.where.price = { [Op.gte]: minPrice };
  }
  if (maxPrice) {
    options.where.price = { [Op.lte]: maxPrice };
  }
  let allSpots = await Spot.findAll(options);

  allSpots = allSpots.map((spot) => {
    const reviews = spot.Reviews;
    const numReviews = reviews.length;
    let sum = 0;
    reviews.forEach((review) => {
      sum += review.stars;
    });
    const avgRating = sum / numReviews;
    spot.dataValues.avgRating = avgRating;
    delete spot.dataValues.Reviews;

    spot.dataValues.previewImage = "";
    if (spot.dataValues.SpotImages) {
      const foundSpotImage = spot.dataValues.SpotImages.find((image) => {
        return image.preview;
      });
      if (foundSpotImage) {
        spot.dataValues.previewImage = foundSpotImage.url;
      }
    }
    spot.dataValues.createdAt = formatDate(spot.dataValues.createdAt);
    spot.dataValues.updatedAt = formatDate(spot.dataValues.updatedAt);

    delete spot.dataValues.SpotImages;
    return spot;
  });
  const resObj = { Spots: allSpots, page, size };
  return res.status(200).json(resObj);
});

//Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const curUserId = req.user.id;
  const allSpots = await Spot.findAll({
    where: { ownerId: curUserId },
    include: [
      {
        model: SpotImage,
      },
      {
        model: Review,
      },
    ],
  });
  if (curUserId !== allSpots[0].ownerId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  const getSpotsRes = allSpots.map((spot) => {
    let totalStars = 0;
    let avgRating = null;
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
      previewImage: spot.SpotImages.url || null
    };
  });

  return res.json({ Spots: getSpotsRes });
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const curUserId = req.user.id;
  const deletedSpot = await Spot.findByPk(spotId);
  if (!deletedSpot) {
    res.status(404).json("Spot couldn't be found");
  }
  if (deletedSpot && deletedSpot.ownerId === curUserId) {
    await deletedSpot.destroy();
    return res.json("Successfully deleted");
  }
  res.status(403).json({
    message: "Forbidden",
  });
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

const validateSpotBody = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .notEmpty()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  check("lng")
    .notEmpty()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  check("name")
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

//Edit a Spot
//Updates and returns an existing spot.
router.put(
  "/:spotId",
  requireAuth,
  validateSpotBody,
  async (req, res, next) => {
    const { spotId } = req.params;
    const curUserId = req.user.id;
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
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }
    if (spot.ownerId !== curUserId) {
      return res.status(403).json({
        message: "Forbidden",
      });
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
  }
);

//Create a Spot (require Auth)
router.post("/", requireAuth, validateSpotBody, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

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
});

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
  return res.status(403).json({ message: "Forbidden" });
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

validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review text is required"),
  check("stars")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

//Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
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
      spotId: Number(spotId),
      review: review,
      stars: stars,
    });
    const resReview = {
      id: newReview.id,
      userId: curUserId,
      spotId: Number(spotId),
      review: review,
      stars: stars,
      createdAt: formatWithTime(newReview.createdAt),
      updatedAt: formatWithTime(newReview.updatedAt),
    };

    return res.status(201).json(resReview);
  },
  handleValidationErrors
);

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("startDate is required")
    .isISO8601()
    .withMessage("startDate must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error("startDate cannot be in the past");
      }
      return true;
    }),
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("endDate is required")
    .isISO8601()
    .withMessage("endDate must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("endDate cannot be on or before start date");
      }
      return true;
    }),
  handleValidationErrors,
];
//Create a Booking from a Spot based on the Spot's id

router.post(
  "/:spotId/bookings",
  requireAuth,
  validateBooking,
  async (req, res, next) => {
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
      return res.status(403).json({
        message: "Forbidden",
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
      if ((s <= be && e > bs) || (bs <= e && be > s)) {
        hasConflict = true;
        if ((s > bs && s <= be) || s === bs) {
          console.log(s === bs);
          conflicts.startDate = "Start date conflicts with an existing booking";
        }
        if ((e >= bs && e <= be) || e === be) {
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
    const resBooking = {
      id: newBooking.id,
      spotId: newBooking.spotId,
      userId: newBooking.userId,
      startDate: formatDate(newBooking.startDate),
      endDate: formatDate(newBooking.endDate),
      createdAt: formatWithTime(newBooking.createdAt),
      updatedAt: formatWithTime(newBooking.updatedAt),
    };
    return res.json(resBooking);
  }
);

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
