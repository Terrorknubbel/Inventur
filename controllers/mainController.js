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
            var sql = "SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.* FROM artikelliste LEFT JOIN artikel ON artikel.id = artikelliste.artikelid";
            con.query(sql, function (err, result) {
                res.render('index', {dbres: result});   
            });
        });
    });

    app.get('/entry', function(req, res){
        console.log("Get erhalten");
        //console.log(req.query);
        var sql = "SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.* FROM artikelliste LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE ";

        Object.keys(req.query).forEach(function(key) {
            sql += key + " = '"+ req.query[key] +"' AND "
        });

        if(Object.keys(req.query).length === 0){
            sql = sql.substring(0, sql.length - 7);   //cut 'WHERE'
            
        }else{
            sql = sql.substring(0, sql.length - 5);   //cut last 'AND'
        }
 
        
        try{
            console.log(sql);
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.send(result);
             });
        }catch(e){
            console.error(e);
        }
        
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

    app.post('/checkValue', function (req, res) {
        
        var postVal = req.body;
        var sql;
        console.log(req.body.entry);
        if(req.body.entry === "name"){
            sql = "SELECT name FROM `artikel`";
            con.query(sql, function (err, result) {
                if (err) throw err;
                var results = [];
                for(var i = 0; i < result.length; i++){
                    if(postVal.val.length > 0){
                        if(result[i].name.startsWith(postVal.val)){
                            results.push(result[i].name);
                            
                        }
                    }
                    
                }
                res.send(results);
             });
             
        }else if(req.body.entry === "location"){
            sql = "SELECT location FROM `artikelliste`";
            con.query(sql, function (err, result) {
                if (err) throw err;
                var results = [];
                for(var i = 0; i < result.length; i++){
                    if(postVal.val.length > 0){
                        if(result[i].location.startsWith(postVal.val)){
                            results.push(result[i].location);
                            
                        }
                    }
                    
                }
                res.send(results);
             });
        }
        

    });


}