'use strict';

const { Booking } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        userId:1,
        startDate:"2025-11-19",
        endDate:"2025-11-23",
        spotId:3,
        totalPrice: "560.00"
      },{
        userId:4,
        startDate:"2025-11-19",
        endDate:"2025-11-23",
        spotId:1,
        totalPrice: "560.00"
      }
    ],{ validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Bookings";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: ["1", "4",] },
    });
  }
};
