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
          description: "For your convenience, the home is equipped with a range of modern amenities to enhance your stay, including high-speed Wi-Fi, a flat-screen smart TV with streaming capabilities, and a washer/dryer for added convenience. Indulge in a refreshing soak in the sleek bathroom, featuring a luxurious walk-in shower and premium bath amenities for a spa-like experience.",
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
          description: "Step outside to the private balcony and bask in the sights and sounds of the city below. Sip your morning coffee as you watch the sunrise over the skyline or unwind with a glass of wine as the city lights twinkle in the evening sky.",
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
          description: "Welcome to your stylish urban retreat nestled in the vibrant heart of the city! This modern and impeccably designed home offers the perfect blend of comfort, convenience, and sophistication, ensuring an unforgettable stay for discerning travelers seeking a true home away from home experience Upon entering, you'll be greeted by an inviting and light-filled living space adorned with contemporary furnishings and chic décor accents. Relax and unwind in the spacious lounge area, complete with plush seating, sleek hardwood floors, and floor-to-ceiling windows that frame stunning city views.",
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
          description: "The open-concept layout seamlessly transitions into the gourmet kitchen, where culinary enthusiasts will delight in preparing meals using top-of-the-line appliances, ample counter space, and a full range of cookware and utensils. Enjoy casual dining at the breakfast bar or gather around the elegant dining table for memorable meals shared with loved ones.",
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
          description: "Retreat to the tranquil bedroom sanctuary, featuring a luxurious king-sized bed dressed in premium linens and sumptuous bedding. With ample closet space and storage solutions, you'll have plenty of room to unpack and settle in for a restful night's sleep.",
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
