var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventur"
});


module.exports = function(app){
    app.get('/', function(req, res){
        con.connect(function(err) {
            var sql = "SELECT * FROM `artikelliste`";
            con.query(sql, function (err, result) {
                res.render('index', {dbres: result});   
            });
        });
    });

    app.post('/create', function (req, res) {

        console.log(req.body);
        // var sql = "INSERT INTO artikelliste (artikel, anzahl, kategorie, ort, aenderungsdatum, aenderungsuhrzeit, mindestanzahl) VALUES ('Company Inc', 'Highway 37')";
        // con.query(sql, function (err, result) {
        //     if (err) throw err;
        //     console.log("1 record inserted");
        //  });

    });
}