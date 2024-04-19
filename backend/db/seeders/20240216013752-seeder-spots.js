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
          description: "For your convenience, the home is equipped with",
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
          description: "Step outside to the private balcony and bask in the sights and sounds of the city below. Sip your morning coffee as you watch the sunrise over the skyline or unwind with a glass of wine ",
          price: "343",
        },
        {
          ownerId: "3",
          address: "122 Late st",
          city: "Miami",
          state: "NY",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Welcome to your stylish urban retreat nestled in the vibrant heart of the city! ",
          price: "1000",
        },
        {
          ownerId: "1",
          address: "122 Main st",
          city: "Miami",
          state: "Fl",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "The open-concept layout seamlessly transitions into the gourmet kitchen, where culinary enthusiasts will delight ",
          price: "133",
        },
        {
          ownerId: "2",
          address: "994 Chare St",
          city: "Arlen",
          state: "DC",
          country: "USA",
          lat: "37.7645358",
          lng: "-137.7645358",
          name: "Random",
          description: "Retreat to the tranquil bedroom sanctuary, featuring a luxurious king-sized bed dressed in premium linens and sumptuous bedding.",
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
