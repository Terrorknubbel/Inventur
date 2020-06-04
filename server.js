var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var ldap = require('ldapjs');

var controller = require('./controllers/mainController');

app.set('view engine', 'ejs');


app.use('/assets', express.static('assets'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

controller(app);

app.listen(3000, () => {
    console.log("Server is listening on port: 3000");
  });