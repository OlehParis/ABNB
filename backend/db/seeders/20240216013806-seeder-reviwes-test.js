"use strict";

const { Review } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          review: "good one",
          stars: 3,
          spotId: 1,
          userId: 1,
        },
        {
          review: "good two",
          stars: 2,
          spotId: 1,
          userId: 2,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: ["1", "2"] },
    });
    ///...
  },
};
