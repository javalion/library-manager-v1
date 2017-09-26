const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var db = require('./models/index.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false });


// Set View Engine to Pug
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function (req, res) {
        res.render('index');
});

app.get('/books', function(req, res) {

    var filter = req.query.filter;
    if (filter === 'overdue') {
        db.books.findAll(
            {include: [{model: db.loans, where: {loaned_on: {$ne: null}, return_by: {$lt: new Date()}, returned_on: {$eq: null}}}]}
        ).then(function (books) {
            res.render('books', {books: books});
        });
    } else if (filter === 'checkedout') {
        db.books.findAll(
            {include: [{model: db.loans, where: {loaned_on: {$ne: null}, returned_on: {$eq: null}}}]}
        ).then(function (books) {
            res.render('books', {books: books});
        });
    } else  {
        db.books.findAll(
            {include: [{model: db.loans}]}
        ).then(function (books) {
            res.render('books', {books: books});
        });
    }
});

app.get('/book_detail', function(req, res) {
    var id = req.query.id;
    db.books.findAll({where: {id: id},
        include: [
            {model: db.loans, include: [
                {model: db.patrons, required: true}
                ]}]}).then(function (books) {
        res.render('book_detail', {book: books[0]})
    });
});

app.get('/new_book', function(req, res) {
    res.render('new_book');
});

// Handle New Book Post
app.post('/new_book', urlencodedParser, function(req, res) {
    const book = db.books.build(req.body);
    if (isValidBookArguments(book)) {
        book.save().then(() => {
            res.redirect("/books");
    })
    .catch((e) => {
            res.send(e);
    });
    } else {
        res.redirect('/new_book');
    }
});

// Handle Update Book Post
app.post('/update_book', urlencodedParser, function(req, res) {
    var id = req.body.id;
    db.books.findAll({where: {id: id},
        include: [
            {model: db.loans, include: [
                {model: db.patrons, required: true}
            ]}]}).then(function (books) {
        const book = books[0];
        book.title = req.body.title;
        book.author = req.body.author;
        book.genre = req.body.genre;
        book.first_published = req.body.first_published;
        if (isValidBookArguments(book)) {
            book.save().then(() => {
                res.redirect("/books");
        })
        .catch((e) => {
                res.send(e);
        });
        } else {
            res.redirect('/update_book?' + book.id);
        }
    });
});

app.get('/patrons', function(req, res) {
    db.patrons.findAll().then(function (patrons) {
        res.render('patrons', {patrons: patrons});
    });
});

app.get('/loans', function(req, res) {

    var filter = req.query.filter;
    if (filter === 'overdue') {
        db.loans.findAll(
            {where: {returned_on: {$eq: null}, return_by: {$lt: new Date()}}, include: [{model: db.books, required: true},{model: db.patrons, required: true}]}
        ).then(function (loans) {
            res.render('loans', {loans: loans});
        });
    } else if (filter === 'checkedout') {
        db.loans.findAll(
            {where: {returned_on: {$eq: null}}, include: [{model: db.books, required: true},{model: db.patrons, required: true}]}
        ).then(function (loans) {
            res.render('loans', {loans: loans});
        });
    } else  {
        db.loans.findAll(
            {include: [{model: db.books, required: true},{model: db.patrons, required: true}]}
        ).then(function (loans) {
            res.render('loans', {loans: loans});
        });
    }
});

// Display New Loan Screen
app.get('/new_loan', function(req, res) {
    db.sequelize.query('Select b.id, b.title from books b where b.id not in (Select l.book_id from loans l) UNION Select b.id, b.title from books b where b.id not in (Select l.book_id from loans l where returned_on is null)', {type: db.sequelize.QueryTypes.SELECT}).then(books => {
        db.patrons.findAll().then(function (patrons) {
            res.render('new_loan',{books: books, patrons: patrons});
        });
    });
});

// Process New Loan
app.post('/new_loan', urlencodedParser, function(req, res) {
    const loan = db.loans.build(req.body);
    if (isValidLoanArguments(loan)) {
        loan.save().then(() => {
            res.redirect("/loans");
    })
    .catch((e) => {
            res.send(e);
    });
    } else {
        res.redirect('/new_book');
    }
});

// Display New Patron Screen
app.get('/new_patron', function(req, res) {
        res.render('new_patron');
});

// Display Patron Detail Screen
app.get('/patron_detail', function(req, res) {
    var id = req.query.id;
    db.patrons.findAll({where: {id: id}}).then(function (patrons) {
        db.loans.findAll(
            {where: {patron_id: id, returned_on: {$eq: null}}, include: [{model: db.books, required: true}]}
        ).then(function (loans) {
            res.render('patron_detail', {patron: patrons[0], loans: loans});
        });
    });
});

// Display Return Book Screen
app.get('/return_book', function(req, res) {
    var patronId = req.query.patron_id;
    var bookId = req.query.book_id;
    db.patrons.findAll({where: {id: patronId}}).then(function (patrons) {
        db.loans.findAll(
            {where: {book_id: bookId}, include: [{model: db.books, required: true}]}
        ).then(function (loans) {
            res.render('return_book', {patron: patrons[0], loan: loans[0]});
        });
    });
});

// Process New Patron
app.post('/new_patron', urlencodedParser, function(req, res) {
    const patron = db.patrons.build(req.body);
    if (isValidPatronArguments(patron)) {
        patron.save().then(() => {
            res.redirect("/patrons");
    })
    .catch((e) => {
            res.send(e);
    });
    } else {
        res.redirect('/new_patron');
    }
});

// Process Update Patron
app.post('/update_patron', urlencodedParser, function(req, res) {
    const patron = db.patrons.build(req.body);
    var id = req.body.id;
    db.patrons.findAll({where: {id: id}}).then(function (patrons){
        var origPatron = patrons[0];
        if (isValidPatronArguments(patron)) {
            origPatron.first_name = patron.first_name;
            origPatron.last_name = patron.last_name;
            origPatron.address = patron.address;
            origPatron.email = patron.email;
            origPatron.library_id = patron.library_id;
            origPatron.zip_code = patron.zip_code;
            origPatron.save().then(() => {
                res.redirect("/patrons");
        })
        .catch((e) => {
                res.send(e);
        });
        } else {
            res.redirect('/patron_detail?id=' + req.body.id);
        }
    });
});

// Process Return Book
app.post('/return_book', urlencodedParser, function(req, res) {
    db.loans.findAll({where: {id: req.body.id}}).then(function (loans) {
        var loan = loans[0];
        loan.returned_on = req.body.returned_on;
        loan.save().then(() => {
            res.redirect("/loans");
    })
        .
        catch((e) => {
            res.send(e);
    })
        ;
    })});

function isValidBookArguments(book) {
    if (book.title.trim().length > 0 &&  book.author.trim().length > 0 && book.genre.trim().length > 0) {
        if (book.first_published.length > 0) {
            if (isNaN(book.first_published)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function isValidPatronArguments(patron) {
    return true;
}


//Validate Loan Arguments

function isValidLoanArguments(loan) {
    return true;
}

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});