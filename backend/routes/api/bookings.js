// backend/routes/api/review-images.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, ReviewImage, Booking } = require("../../db/models");

//Get all of the Current User's Bookings (Auth require)
router.get("/current", requireAuth, async (req, res, next) => {
  const curUserId = req.user.id;
  const curBookings = await Booking.findAll({
    where: { userId: curUserId },
    include: [
      { model: Spot, attributes: { exclude: ["createdAt", "updatedAt"] } },
    ],
  });
  // if(!curBookings) {
  //     res.status(201).json(you)
  // }
  res.json(curBookings);
});

//Delete a Booking
router.get("/:bookingId", requireAuth, async (req, res, next) => {
  const curUserId = req.user.id;
  const { bookingId } = req.params;
  const allBooking = await Booking.findAll({
    where: { id: bookingId },
    include: [Spot, User],
  });
  if (allBooking.length === 0 || !allBooking[0]) {
    res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  const bs = allBooking[0].startDate.getTime();
  const be = allBooking[0].endDate.getTime();
  const curTime = new Date().getTime();
  //  console.log(curTime > bs && curTime < be)
  if (curTime > bs && curTime < be) {
    res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }

  //   Booking must belong to the current user
  if (curUserId === allBooking[0].userId) {
    await allBooking[0].destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }

  //Spot must belong to the current user

  if (allBooking[0].Spot && curUserId === allBooking[0].Spot.ownerId) {
    await allBooking[0].destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
  
   
  
});

module.exports = router;
