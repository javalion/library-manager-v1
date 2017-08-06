const express = require('express');
const app = express();

// Set View Engine to Pug
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});