'use strict';
const Sequelize = require('Sequelize');

module.exports = function(sequelize, DataTypes) {
    var Book = sequelize.define('books', {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        title: Sequelize.STRING,
        author: Sequelize.STRING,
        genre: Sequelize.STRING,
        first_published: Sequelize.INTEGER
    }, {
        timestamps: false,
        underscored: true
    });
    return Book;
};
