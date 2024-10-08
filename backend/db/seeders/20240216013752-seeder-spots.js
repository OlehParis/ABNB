"use strict";

const { Spot } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: "1",
          address: "1222 SW 3rd st",
          city: "Naples",
          state: "FL",
          country: "USA",
          lat: "26.1420",
          lng: "-81.7948",
          name: "Home",
          description: "For your convenience, the home is equipped with",
          price: "250",
        },
        {
          ownerId: "2",
          address: "122 Makia St",
          city: "Sarasota",
          state: "FL",
          country: "USA",
          lat: "27.3364",
          lng: "-82.5307",
          name: "Cozy Stay",
          description:
            "Step outside to the private balcony and bask in the sights and sounds of the city below. Sip your morning coffee as you watch the sunrise over the skyline or unwind with a glass of wine.",
          price: "343",
        },
        {
          ownerId: "1",
          address: "122 Main St",
          city: "Miami",
          state: "FL",
          country: "USA",
          lat: "25.7617",
          lng: "-80.1918",
          name: "Villa Azur",
          description:
            "The open-concept layout seamlessly transitions into the gourmet kitchen, where culinary enthusiasts will delight.",
          price: "133",
        },
        {
          ownerId: "4",
          address: "450 Beach Ave",
          city: "Naples",
          state: "FL",
          country: "USA",
          lat: "26.1412",
          lng: "-81.7950",
          name: "Beachfront Bliss",
          description: "Experience stunning beach views with luxury amenities.",
          price: "400",
        },
        {
          ownerId: "2",
          address: "789 Pine St",
          city: "Orlando",
          state: "FL",
          country: "USA",
          lat: "28.5383",
          lng: "-81.3792",
          name: "City Retreat",
          description:
            "A modern condo in the heart of downtown Orlando. Close to all major attractions.",
          price: "275",
        },
        {
          ownerId: "4",
          address: "1224 Oak Blvd",
          city: "Austin",
          state: "TX",
          country: "USA",
          lat: "30.2672",
          lng: "-97.7431",
          name: "Hilltop Hideaway",
          description: "Secluded and serene getaway near the Texas Hill Country.",
          price: "320",
        },
        {
          ownerId: "1",
          address: "567 Gulf Dr",
          city: "Tampa",
          state: "FL",
          country: "USA",
          lat: "27.9506",
          lng: "-82.4572",
          name: "Bay View",
          description: "Charming house with bay views and modern interiors.",
          price: "290",
        },
        {
          ownerId: "4",
          address: "102 Park Lane",
          city: "Houston",
          state: "TX",
          country: "USA",
          lat: "29.7604",
          lng: "-95.3698",
          name: "Urban Oasis",
          description: "A tranquil space with modern design near downtown Houston.",
          price: "355",
        },
        {
          ownerId: "2",
          address: "543 Coastal Ave",
          city: "Destin",
          state: "FL",
          country: "USA",
          lat: "30.3935",
          lng: "-86.4958",
          name: "Coastal Paradise",
          description: "Stunning coastal retreat with beach access.",
          price: "500",
        },
        {
          ownerId: "1",
          address: "789 Sunset Blvd",
          city: "Key West",
          state: "FL",
          country: "USA",
          lat: "24.5551",
          lng: "-81.7800",
          name: "Tropical Escape",
          description: "Relax in this tropical oasis just steps away from the beach.",
          price: "375",
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
  },
};
