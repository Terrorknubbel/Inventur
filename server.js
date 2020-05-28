var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var controller = require('./controllers/mainController');

app.set('view engine', 'ejs');


app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

controller(app);

app.listen(3000, () => {
    console.log("Server is listening on port: 3000");
  });