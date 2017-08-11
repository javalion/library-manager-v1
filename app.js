const express = require('express');
const app = express();
var Book = require("./models").books;

// Set View Engine to Pug
app.set('view engine', 'pug');

app.get('/', function (req, res) {
        res.render('index');
});

app.get('/books', function(req, res) {
    Book.findAll().then(function(books){
    res.render('books', {books: books});
    });
});

app.get('/patrons', function(req, res) {
    res.render('patrons');
});

app.get('/lonas', function(req, res) {
    res.render('loans');
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});