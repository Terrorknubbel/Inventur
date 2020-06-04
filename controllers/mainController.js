var mysql = require('mysql');
var path = require('path');
var md5 = require("md5");
var ldap = require('ldapjs');



var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventur"
});


module.exports = function(app){

    
    app.get('/', async (req, res) => {

        if (req.session.loggedin) {
            const result = await getAll();     // get db data
            res.render('index', {dbres: result, session: req.session}); //load index with db data   
        
        } else {
            res.render('login'); //redirect to login page if not logged in
        }
    });

    app.get("/user", function(req, res){
        res.send(req.session.username);
    });

    app.get("/logout", function(req, res){  //destroy current session
        req.session.destroy();
        res.send("Logged Out");
    });

    app.post('/auth', function(request, response) {     //authentication
        var username = request.body.username;           //get params
        var password = request.body.password;

        var name = "ABBW" + "\\" + username;    

        if(username && password){

            var client = ldap.createClient({
                url: 'ldap://bbw-azubi.local'          //domain
              });

            client.bind(name, password, function(err) {
                console.log(err);
                if(err == null){                       //if no error occurs
                    request.session.loggedin = true;    //set session
                    request.session.username = username;
                    response.redirect('/');            //redirect to home
    
                }else{
                    response.send('Incorrect Username and/or Password!');   //Error message if username or password is incorrect
                }
                response.end();

            });
        }else{
            response.send('Please enter Username and Password!');           //if no username/passwort exists
            response.end();
        }

    });

    function getAll(){
        return new Promise((resolve, reject) => {
            con.query("SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.* FROM artikelliste LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE deleted = false", function (err, result) {     //send results
                if (err)  reject(err);
                resolve(result);
             });
        })
    }

    function getEntryById(id) {
        return new Promise((resolve, reject) => {
            con.query("SELECT * FROM artikelliste WHERE id = ? LIMIT 1",[id], function (err, result) {     
                if (err)  reject(err);
                resolve(result[0]);
             });
        })
    }

    function getItemById(id){
        return new Promise((resolve, reject) => {
            con.query("SELECT * FROM artikel WHERE id = ? LIMIT 1",[id], function (err, result) {    
                if (err)  reject(err);
                resolve(result[0]);
             });
        })
    }

    function getItemByName(Name){
        return new Promise((resolve, reject) => {
            con.query("SELECT * FROM artikel WHERE name = ? LIMIT 1",[Name], function (err, result) {    
                if (err)  reject(err);
                resolve(result[0]);
             });
        })
    }

    function markEntryAsDeleteById(id){
        return new Promise((resolve, reject) => {
            con.query("UPDATE artikelliste SET deleted = true WHERE id = ?",[id], function (err, result) {    
                if (err)  reject(err);
                resolve(result[0]);
             });
        })
    }

    function createEntry(artikelid, number, minimum_number, location, creator, change_by, date, time){
        console.log("create Entry function");
        return new Promise((resolve, reject) => {
            con.query("INSERT INTO artikelliste (artikelid, number, minimum_number, location, creator, change_by, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",[artikelid, number, minimum_number, location, creator, change_by, date, time], function (err, result) {    
                if (err)  reject(err);
                console.log(result);
                console.log(err);
                resolve(result);
             });
        })
    }



    app.delete('/entry/:id', async (req, res) => {   //delete item
        console.log("delete request");
        if (req.session.loggedin) {
            try {
                const result = await markEntryAsDeleteById(req.params.id);

                res.send(result);
            } catch  (err) {
                res.status(500).send("Internal Server Error");
            }
            
        }else {
            res.render('login'); //redirect to login page if not logged in
        }
         //log("Delete", id);
    });

    app.get("/entry/:id", async (req, res) => {
        try {
            const result = await getEntryById(req.params.id);

            res.status(200).json({
                entry: result
            })
        } catch  (err) {
            res.status(500).send("Internal Server Error");
        }
    })

    app.get('/entry', function(req, res){       //get entries from db
        console.log("Get erhalten");
        //console.log(req.query);
        var sql = "SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.* FROM artikelliste LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE ";

        Object.keys(req.query).forEach(function(key) {  //build WHERE clause with get params
            sql += key + " = '"+ req.query[key] +"' AND "
        });

        if(Object.keys(req.query).length === 0){
            sql = sql.substring(0, sql.length - 7);   //cut 'WHERE'
            
        }else{
            sql = sql.substring(0, sql.length - 5);   //cut last 'AND'
        }
 
        
        try{
            console.log(sql);               
            con.query(sql, function (err, result) {     //send results
                if (err) throw err;
                res.send(result);
             });
        }catch(e){
            console.error(e);
        }
        
    });

    app.post('/create', async (req, res) => {       //create entry in db

        console.log(req.body, req.session.username);
        var username = req.session.username;
        var sql = "INSERT INTO artikel (name, category, keywords) VALUES ('"+req.body.artikel+"', '"+req.body.kategorie+"', '"+req.body.keywords+"')";
        con.query(sql, function (err, result) {     //create item in 'artikel' list
            if (err) throw err;
            console.log("1 article inserted");
         });


        var fulldate = getDate();   //get time/date
        var time = getTime();

        try {
            const item = await getItemByName(req.body.artikel);
            console.log(item);

      

            const bla = await createEntry(item.id, req.body.anzahl, req.body.mindestanzahl, req.body.ort, username, username, fulldate, time);
            console.log("entry erstellt");

            res.status(200).json({
                entry: bla
            })
        } catch  (err) {
            res.status(500).send("Internal Server Error");
        }

    });

    app.post("/update", function (req, res){    //updates an entry
        console.log(req.body);  
        var sql = "SELECT * FROM artikel WHERE name = '"+ req.body.artikel +"'";    //get item by name
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result[0].id);
            var fulldate = getDate();   //get time/date
            var time = getTime();

            //update item in 'artikel'
            var sqlArtikel = "UPDATE artikel SET category = '"+req.body.kategorie+"', keywords = '"+req.body.keywords+"' WHERE id= '"+result[0].id+"'";
            con.query(sqlArtikel, function (err, result) {
                if (err) throw err;
                console.log("1 artikel updated");
            });

            //update item in 'artikelliste'
            var sqlArtikelliste = "UPDATE artikelliste SET number = '"+req.body.anzahl+"', minimum_number = '"+req.body.mindestanzahl+"', change_by = '"+req.session.username+"', date = '"+fulldate+"', time = '"+time+"' WHERE artikelid = '"+result[0].id+"'";
            con.query(sqlArtikelliste, function (err, result) {
                if (err) throw err;
                console.log("1 entry updated");
            });
            res.send("updated");

         });
    });

    

    app.post('/checkValue', function (req, res) {   //checks itemname for autocomplete
        
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

    function getDate(){
        var d = new Date();
        var date = d.getUTCDate();
        var month = d.getUTCMonth();
        month += 1;
        var year = d.getUTCFullYear();

        if(date <= 9){
            date = "0" + date;
        }
        if(month <= 9){
            month = "0" + month;
        }

        var fulldate = date + "." + month + "." + year;

        return fulldate;
    }

    function getTime(){
        var d = new Date();

        var hours = d.getHours();
        var minutes = d.getMinutes();

        if(hours <= 9){
            hours = "0" + hours;
        }
        if(minutes <= 9){
            minutes = "0" + minutes;
        }

        var time = hours + ":" + minutes;

        return time;
    }

    function log(event, id){
        console.log(event, id);

        switch(event){
            case "Delete":
                var sql = "SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.id, artikelliste.number, artikelliste.minimum_number, artikelliste.location, artikelliste.creator, artikelliste.change_by, artikelliste.date, artikelliste.time FROM artikelliste LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE id = '"+id+"'";
                
                break;
            default:
                break;
        }

        var sql = "SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.number, artikelliste.minimum_number, artikelliste.location, artikelliste.creator, artikelliste.change_by, artikelliste.date, artikelliste.time FROM artikelliste LEFT JOIN artikel ON artikel.id = artikelliste.artikelid";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record deleted");
            res.send("success");
         });
    }

}