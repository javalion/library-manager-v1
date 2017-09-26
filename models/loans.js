'use strict';
const Sequelize = require('Sequelize');

module.exports = function(sequelize, DataTypes) {
  var Loan =  sequelize.define('loans', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    book_id: Sequelize.INTEGER,
    patron_id: Sequelize.INTEGER,
    loaned_on: Sequelize.DATEONLY,
    return_by: Sequelize.DATEONLY,
    returned_on: Sequelize.DATEONLY
  }, {
      timestamps: false,
      underscored: true
  });


  return Loan;
};