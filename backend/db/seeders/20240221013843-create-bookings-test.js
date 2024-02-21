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
        startDate:"2024-11-19",
        endDate:"2024-11-23",
        spotId:1,
      },{
        userId:2,
        startDate:"2024-11-19",
        endDate:"2024-11-23",
        spotId:2,
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Bookings";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: ["1", "2",] },
    });
  }
};
