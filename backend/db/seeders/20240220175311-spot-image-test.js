'use strict';

const { SpotImage} = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
    { url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    spotId:1,
    preview: true },
    { url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:2,
    preview: true },
    { url: "https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:3,
    preview: true},
    { url: "https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:4,
    preview: true },
    { url: "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:5,
    preview: true },
    
  ],{ validate: true } );
    },
  

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ["1", "2", "3", "4" ,"5"]}
    });
  }
};
