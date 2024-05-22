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
    { url: "https://media.istockphoto.com/id/1293762741/photo/modern-living-room-interior-3d-render.jpg?s=612x612&w=0&k=20&c=iZ561ZIXOtPYGSzqlKUnLrliorreOYVz1pzu8WJmrnc=",
    spotId:1,
    preview: false },
    { url: "https://media.istockphoto.com/id/1373329869/photo/modern-living-room-interior-3d-render.jpg?s=612x612&w=0&k=20&c=VBzd-UExnctNDY9rfqUc5Ys8IUyBmELYT0R2SSZ1_L4=",
    spotId:1,
    preview: false },
    { url: "https://media.istockphoto.com/id/1392136805/photo/modern-luxury-kitchen-interior-design-3d-rendering.jpg?s=612x612&w=0&k=20&c=9M12PuSQLJRyV64KWyt6tGqyPNEtve5dAS9b8ou-zSc=",
    spotId:1,
    preview: false },
    { url: "https://media.istockphoto.com/id/1188452511/photo/stylish-scandinavian-living-room-with-design-mint-sofa-furnitures-mock-up-poster-map-plants.jpg?s=612x612&w=0&k=20&c=yK0GV6EuqXc09xBFMcNdd7ZjFephsGgSTjPBsvvv630=",
    spotId:1,
    preview: false },
<<<<<<< HEAD
    { url: "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=600",
=======
    { url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
>>>>>>> googleAPI
    spotId:2,
    preview: true },
    { url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:2,
<<<<<<< HEAD
    preview: false},
=======
    preview: false },
>>>>>>> googleAPI
    { url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:2,
    preview: false},
    { url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:2,
    preview: false },
    { url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:2,
    preview: false },
    { url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:2,
    preview: false },
    { url: "https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:3,
    preview: true},
<<<<<<< HEAD
=======
    { url: "https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:4,
    preview: true },
    { url: "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:5,
    preview: true },
    { url: "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=800",
    spotId:5,
    preview: false },
>>>>>>> googleAPI
    
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
