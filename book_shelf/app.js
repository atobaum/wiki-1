var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.js').dev; //dev: development, real: real service

var dbController = require('./lib/db_controller.js');
var config = require('./config.js').dev;
var aladin = require('./lib/aladin.js');
aladin = new aladin(config.api.aladin);
//var dbInit = require('./lib/db_init.js');
//dbInit(config.db);
//console.log("Done");
app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res, next) {
    res.render('main', {"title": "Bookshelf"});
});

app.get('/addread', function(req, res, next){
    res.render('addread', {
        "title": "Add Book"
    });
});

app.get('/addread', function(req, res, next){


    res.render('addread', {
        "title": "Add Book"
    });
});

app.get('/search', function(req, res){
    res.render('main');
});


app.get('/api/searchbook', function(req, res){
    res.writeHead(200, {'Content-Type' : "application/json;charset=UTF-8"});
    aladin.search(req.query.word ,"Keyword", function(data){
        res.end(JSON.stringify(data));
    });
});


app.post('/api/addread', function(req, res, next){
    var data = req.body;
    dbController.isExistBook(data.isbn13, function(){   //when ther exists a book.
        dbController.addRead(data);
        res.redirect('/bookshelf');
    },
    function(){
        aladin.bookInfo(data.isbn13, function(book){
            dbController.addTitle(book, function(){
                dbController.addRead(data);
                res.redirect('/bookshelf');
            });
        });
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
