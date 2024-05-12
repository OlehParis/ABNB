"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
      Booking.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      startDate: {
        type: DataTypes.DATE,
        validate: {
          isInFuture(value) {
            if (value < new Date()) {
              throw new Error("startDate cannot be in the past");
            }
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        validate: {
          isAfterStartDate(value) {
            if (value <= this.getDataValue("startDate")) {
              throw new Error("endDate cannot be on or before startDate");
            }
          },
        },
      },
      totalPrice: {
        type: Sequelize.STRING
      },
      spotId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
