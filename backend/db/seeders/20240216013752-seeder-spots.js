"use strict";

const { Spot } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: "1",
          address: "122 Marki st",
          city: "Miami",
          state: "Fl",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Best place eva",
          price: "1000",
        },
        {
          ownerId: "2",
          address: "122 Marki st",
          city: "Miami",
          state: "Fl",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Best place eva",
          price: "1000",
        },
        {
          ownerId: "4",
          address: "122  st",
          city: "Miami",
          state: "Fl",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Best place eva",
          price: "1000",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: ["1", "2", "3"] },
    });
    ///...
  },
};
