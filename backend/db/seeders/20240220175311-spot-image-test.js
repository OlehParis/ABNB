"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        // Spot 1
        {
          url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
          spotId: 1,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276754/pexels-photo-276754.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 1,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276746/pexels-photo-276746.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 1,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276758/pexels-photo-276758.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 1,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276752/pexels-photo-276752.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 1,
          preview: false,
        },

        // Spot 2
        {
          url: "https://images.pexels.com/photos/259957/pexels-photo-259957.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 2,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
          spotId: 2,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276762/pexels-photo-276762.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 2,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276768/pexels-photo-276768.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 2,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276756/pexels-photo-276756.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 2,
          preview: false,
        },

        // Spot 3
        {
          url: "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 3,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276759/pexels-photo-276759.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 3,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 3,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 3,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/2121120/pexels-photo-2121120.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 3,
          preview: false,
        },

        // Spot 4
        {
          url: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 4,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276758/pexels-photo-276758.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 4,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276752/pexels-photo-276752.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 4,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276746/pexels-photo-276746.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 4,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276754/pexels-photo-276754.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 4,
          preview: false,
        },

        // Spot 5
        {
          url: "https://images.pexels.com/photos/259600/pexels-photo-259600.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 5,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276762/pexels-photo-276762.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 5,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276768/pexels-photo-276768.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 5,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276756/pexels-photo-276756.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 5,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276759/pexels-photo-276759.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 5,
          preview: false,
        },

        // Spot 6
        {
          url: "https://images.pexels.com/photos/2091166/pexels-photo-2091166.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 6,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276759/pexels-photo-276759.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 6,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 6,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 6,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/2121120/pexels-photo-2121120.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 6,
          preview: false,
        },

        // Spot 7
        {
          url: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 7,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276746/pexels-photo-276746.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 7,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276758/pexels-photo-276758.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 7,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276768/pexels-photo-276768.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 7,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276756/pexels-photo-276756.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 7,
          preview: false,
        },

        // Spot 8
        {
          url: "https://images.pexels.com/photos/164522/pexels-photo-164522.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 8,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276746/pexels-photo-276746.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 8,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276758/pexels-photo-276758.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 8,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276768/pexels-photo-276768.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 8,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276756/pexels-photo-276756.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 8,
          preview: false,
        },

        // Spot 9
        {
          url: "https://images.pexels.com/photos/2155202/pexels-photo-2155202.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 9,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276759/pexels-photo-276759.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 9,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 9,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 9,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276746/pexels-photo-276746.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 9,
          preview: false,
        },

        // Spot 10
        {
          url: "https://images.pexels.com/photos/259685/pexels-photo-259685.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 10,
          preview: true,
        },
        {
          url: "https://images.pexels.com/photos/276758/pexels-photo-276758.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 10,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276746/pexels-photo-276746.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 10,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/276768/pexels-photo-276768.jpeg?auto=compress&cs=tinysrgb&w=800",
          spotId: 10,
          preview: false,
        },
        {
          url: "https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg?auto=compress&cs=tinysrgb&w=600",
          spotId: 10,
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    });
  },
};
