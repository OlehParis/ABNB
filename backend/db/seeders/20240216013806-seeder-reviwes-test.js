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
          review: "My stay at the Lakeview Cottage near Crystal Lake was an unforgettable retreat that exceeded all my expectations. ",
          stars: 3,
          spotId: 1,
          userId: 1,
        },
        {
          review: "A special mention must go to the spacious wooden deck at the back of the cottage. It was our favorite spot to sip ",
          stars: 2,
          spotId: 1,
          userId: 2,
        },
        {
          review: "A special mention must go to the spacious wooden deck at the back of the cottage. It was our favorite spot to sip ",
          stars: 2,
          spotId: 2,
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
