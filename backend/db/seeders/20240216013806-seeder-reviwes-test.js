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
          review: "My stay at the Lakeview Cottage near Crystal Lake was an unforgettable retreat that exceeded all my expectations. Situated in the serene Woodland Hills neighborhood, this charming cottage provided a tranquil escape with breathtaking views of the lake and surrounding forests. Upon arrival, I was warmly welcomed by the host, Emily Thompson, who was exceptionally kind and attentive. Emily ensured the check-in process was seamless and took the time to acquaint me with the cottage's various amenities and the local area's attractions.",
          stars: 3,
          spotId: 1,
          userId: 1,
        },
        {
          review: "A special mention must go to the spacious wooden deck at the back of the cottage. It was our favorite spot to sip our morning coffee and bask in the tranquil beauty of the surroundings. Although our stay was near perfect, we did notice the Wi-Fi connectivity was somewhat inconsistent in the bedrooms. This was a minor inconvenience and something easily overlooked given the cottage's many charms. ",
          stars: 2,
          spotId: 1,
          userId: 2,
        },
        {
          review: "A special mention must go to the spacious wooden deck at the back of the cottage. It was our favorite spot to sip our morning coffee and bask in the tranquil beauty of the surroundings. Although our stay was near perfect, we did notice the Wi-Fi connectivity was somewhat inconsistent in the bedrooms. This was a minor inconvenience and something easily overlooked given the cottage's many charms. ",
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
