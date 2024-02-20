"use strict";
const { ReviewImage } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([{ URL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bhg.com%2Fhome-improvement%2Fexteriors%2Fcurb-appeal%2Fhouse-styles%2F&psig=AOvVaw1QUiOa1eITW-hcXUnA3Kio&ust=1708538187367000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJi63e--uoQDFQAAAAAdAAAAABAO",
  reviewId:1 },
  { URL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bhg.com%2Fhome-improvement%2Fexteriors%2Fcurb-appeal%2Fhouse-styles%2F&psig=AOvVaw1QUiOa1eITW-hcXUnA3Kio&ust=1708538187367000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJi63e--uoQDFQAAAAAdAAAAABAO",
  reviewId:2 },
  { URL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bhg.com%2Fhome-improvement%2Fexteriors%2Fcurb-appeal%2Fhouse-styles%2F&psig=AOvVaw1QUiOa1eITW-hcXUnA3Kio&ust=1708538187367000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJi63e--uoQDFQAAAAAdAAAAABAO",
  reviewId:3 },
  { URL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bhg.com%2Fhome-improvement%2Fexteriors%2Fcurb-appeal%2Fhouse-styles%2F&psig=AOvVaw1QUiOa1eITW-hcXUnA3Kio&ust=1708538187367000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJi63e--uoQDFQAAAAAdAAAAABAO",
  reviewId:4 }]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: ["1, 2, 3 ,4 "]}
    });
  },
};
