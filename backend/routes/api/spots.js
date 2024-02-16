// backend/routes/api/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review } = require("../../db/models");

// Get all Spots
router.get("/", async (req, res, next) => {
  const allSpots = await Spot.findAll({
    where: {
      id: 1,
    },
    include: [User, Review],
  });

  return res.json(allSpots);
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

//Create a Spot (require Auth)
router.post("/", requireAuth, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  try {
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
      ownerId: req.user.id, // Associate the spot with the authenticated user
    });

    // Respond with the newly created spot
    return res.status(201).json(newSpot);
  } catch (error) {
    // Handle validation errors
    // if (error.name === "SequelizeValidationError") {
    //   const errors = {};
    //   error.errors.forEach((err) => {
    //     errors[err.path] = err.message;
    //   });
    //   return res.status(400).json({
    //     message: "Bad Request",
    //     errors,
    //   });
    // }

    // Handle other errors
    return next(error);
  }
}, handleValidationErrors);

module.exports = router;
