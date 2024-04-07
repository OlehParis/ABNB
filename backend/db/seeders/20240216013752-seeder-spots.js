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
          address: "1222 SW 3rd st",
          city: "Naples",
          state: "Fl",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Best place eva",
          price: "250",
        },
        {
          ownerId: "2",
          address: "122 Makia st",
          city: "Sarasota",
          state: "TX",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Best place eva",
          price: "343",
        },
        {
          ownerId: "3",
          address: "122  st",
          city: "Miami",
          state: "NY",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Best place eva",
          price: "1000",
        },
        {
          ownerId: "4",
          address: "122 Main st",
          city: "Miami",
          state: "Fl",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Best place eva",
          price: "133",
        },
        {
          ownerId: "5",
          address: "994 Chare St",
          city: "Arlen",
          state: "DC",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Best place eva",
          price: "140",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: ["1", "2", "4"] },
    });
    ///...
  },
};
