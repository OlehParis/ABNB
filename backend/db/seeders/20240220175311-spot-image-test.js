'use strict';

const { SpotImage} = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([{ url: "httpscom/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    spotId:1,
  preview: true },
    { url: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    spotId:2,
    preview: true },
    { url: "https://thuit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    spotId:3 ,
    preview: true},
    { url: "httpses.nload-23.jpg",
    spotId:4,
    preview: true },
    { url: "s.com/thumborttps://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    spotId:5,
    preview: true },]);
    },
  

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ["1, 2, ,3, 4 ,5 "]}
    });
  }
};
