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
        var sql = "INSERT INTO artikelliste (artikel, anzahl, kategorie, ort, aenderungsdatum, aenderungsuhrzeit, mindestanzahl) VALUES ('"+req.body.artikel+"', '"+req.body.anzahl+"', '"+req.body.kategorie+"', '"+req.body.ort+"', '28.05.2020', '14:00', '"+req.body.mindestanzahl+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
         });

    });

    app.post('/delete', function (req, res) {
        
        var id = parseInt(req.body.id);
    
        var sql = "DELETE FROM artikelliste WHERE id = '"+id+"'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record deleted");
            res.send("success");
         });

    });
}