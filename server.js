var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var pino = require('pino');
var expressPino = require('express-pino-logger');

// var logger = pino({
// 	level: process.env.LOG_LEVEL || 'info',
// 	prettyPrint: { colorize: true }
// });
//var expressLogger = expressPino({ logger });

var controller = require('./controllers/mainController');

app.set('view engine', 'ejs');


app.use('/assets', express.static('assets'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(expressLogger);

controller(app);

app.listen(3000, () => {
	console.log("Server is listening on port: 3000");
});