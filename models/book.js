"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {
    static associate(models) {}
  }
  Book.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter a valid input for title",
          },
          notEmpty: {
            msg: "Please enver a valid input for 'title'",
          },
        },
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enver a valid input for 'author'",
          },
        },
      },
      genre: Sequelize.STRING,
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
