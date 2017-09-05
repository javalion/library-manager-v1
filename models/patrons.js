'use strict';
const Sequelize = require('Sequelize');

module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('patrons', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    address: Sequelize.STRING,
    email: Sequelize.STRING,
    library_id: Sequelize.STRING,
    zip_code: Sequelize.INTEGER
  }, {
      timestamps: false,
      underscored: true

  });
  return Patron;
};