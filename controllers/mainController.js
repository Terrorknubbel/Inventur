var mysql = require("mysql2");
var functions = require("./functions.js");
var fs = require('fs');
var config = require('config');

var con = mysql.createConnection(config.get('dbConfig'));


//check if required Database exists and creates if not exist
fs.readFile('./config/schema.sql', 'utf8', function (err, data) {
  data = data.replace(/\r|\n/g, ' ');
  data2 = "CREATE DATABASE IF NOT EXISTS `inventur` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;USE `inventur`;";

  con.query(data, function (err, result) {
    if (err) {
      console.log(err);
    }
    var con = mysql.createConnection(config.get('dbConfig'));
  }
  );
});

module.exports = function (app) {
  app.get("/", async (req, res) => {
    if (req.session.loggedin) {
      const result = await functions.getAll(); // get db data
      //console.log(JSON.stringify(result));
      var stammdaten = await functions.getStammdaten();

      //console.log(stammdaten);
      res.render("index", { dbres: result, stammdaten: stammdaten, session: req.session }); //load index with db data
    } else {
      res.render("login", { err: req.query.err}); //redirect to login page if not logged in
    }
  });

  app.get("/logout", function (req, res) {
    //destroy current session
    req.session.destroy();
    res.send("Logged Out");
  });

  // if (req.session.loggedin) {
  // } else {
  //   res.render("login", { err: req.query.err }); //redirect to login page if not logged in
  // }

  app.get("/entry", function (req, res) {
    //get entries from db
    if (req.session.loggedin) {
      //console.log(req.query);
      var sql = `SELECT
            artikel.name,
            artikel.category,
            artikel.keywords,
            artikelliste.*
        FROM artikelliste
        LEFT JOIN artikel ON artikel.id = artikelliste.artikelid`;

      try {
        con.query(sql, function (err, result) {
          //send results
          if (err) {
            res.status(500).send("Internal Server Error");

          };
          res.send(result);
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      res.render("login", { err: req.query.err }); //redirect to login page if not logged in
    }
  });

  app.get("/entry/:value", async (req, res) => {
    //if (req.session.loggedin) {
      // try {
        var value = req.params.value;
        var num = /\d/.test(value);
        console.log("num: " + num);
        if(num){
          const result = await functions.getEntryById(value);

          res.send(result);
        }else{
            var sql = `SELECT
                  artikel.name,
                  artikel.category,
                  artikel.keywords,
                  artikelliste.*
              FROM artikelliste
              LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE`;
            
             console.log(value.split("&"));
             var valueArr = value.split("&");
             for(var i = 0; i++; valueArr.length){

             }
        }
          //   Object.keys(req.params.value).forEach(function (key) {
          //   //build WHERE clause with get params
          //   key = key.replace(/['"`]+/g, "");
          //   req.query[key] = req.query[key].replace(/['"`]+/g, "");

          //   if (key == "id") {
          //     newKey = "artikelliste." + key;
          //     sql += `${newKey} = ${req.query[key]} AND `;
          //   } else {
          //     sql += key + " = '" + req.query[key] + "' AND ";
          //   }
          // });

          // if (Object.keys(req.query).length === 0) {
          //   sql = sql.substring(0, sql.length - 7); //cut 'WHERE'
          // } else {
          //   sql = sql.substring(0, sql.length - 5); //cut last 'AND'
          // }
        //}
      // } catch (err) {
      //   res.status(404).send("Internal Server Error");
      // }
    // }else{
    //   res.render("login", { err: req.query.err }); //redirect to login page if not logged in

    // }
  });

  app.get("/entry/name/:name", async (req, res) => {
    if(req.session.loggedin){
      try {
        const result = await functions.getEntryByName(req.params.name);
        res.send(result);
      } catch (err) {
        res.status(404).send("Internal Server Error");
      }
    }else{
      res.render("login", { err: req.query.err }); //redirect to login page if not logged in

    }
      // console.log(req.query);

  });

  app.post("/auth", async (req, res) => {
    //authentication
    var ldap = require("ldapjs");

    var client = ldap.createClient({ url: config.get('ldap.url') });


    client.on("error", function (err) {
      console.warn(
        "LDAP connection failed, but fear not, it will reconnect OK",
        err,
      );
    });

    var username = req.body.username; //get params
    var password = req.body.password;

    var name = "ABBW" + "\\" + username;

    if (username && password) {
      client.bind(name, password, async (err) => {
        if (err == null) {
          //if no error occurs

          var base = "dc=bbw-azubi, dc=local";
          var search_options = {
            scope: 'sub',
            filter: '(&(objectClass=user)(sAMAccountName=' + username + '))',
            attrs: 'memberOf'
          };

          var searchRes = await functions.UserSearch(client, base, search_options);

          req.session.loggedin = true; //set session
          req.session.title = searchRes.title;
          req.session.username = searchRes.sAMAccountName;

          res.redirect("/"); //redirect to home
        } else {
          res.redirect("/?err=FalseCred"); //Error message if username or password is incorrect
        }
        res.end();
      });
    } else {

      //if no username/passwort exists
      res.end();
    }
  });

  app.get("/stammdaten", async (req, res) => {
    if (req.session.loggedin) {
      try {
        var results = await functions.getStammdaten();
        //console.log(results);
        res.render("stammdaten", { result: results, session: req.session });
      } catch (e) {
        res.status(404).send("404 Not Found");
        console.log(e);
      }
    } else {
      res.redirect("/"); //redirect to home

    }
  });

  app.get("/stammdaten/:table", async (req, res) => {
    try {
      switch (req.params.table) {
        case "ort":
          var results = await functions.getOrt();
          break;
        case "kategorie":
          var results = await functions.getKategorie();
          break;
        case "keywords":
          var results = await functions.getKeywords();
          break;
        default:
          var results = "Nothing found ¯\\_(ツ)_/¯";
          break;

      }
      res.send(results);
    } catch (e) {
      res.status(404).send("404 Not Found");
      console.log(e);
    }

  });

  app.get("/stammdaten/:table/:name", async (req, res) => {
    try {
      switch (req.params.table) {
        case "ort":
          var results = await functions.getOrt();
          break;
        case "kategorie":

          break;
        case "keywords":
          var results = await functions.getKeywordsByName(req.params.name);
          break;
        default:
          var results = "Nothing found ¯\\_(ツ)_/¯";
          break;

      }
      res.send(results);
    } catch (e) {
      res.status(404).send("404 Not Found");
      console.log(e);
    }

  });

  //create stammdaten entry
  app.post("/stammdaten/:table", async (req, res) => {
    if (req.params.table == "Stichwörter") {
      req.params.table = "keywords";
    }
    var results = await functions.saveStammdaten(req.params.table.toLowerCase(), req.body.value);
    res.send("Entry Created");
  });

  //delete stammdaten entry
  app.delete("/stammdaten/:table/:name", async (req, res) => {
    var results = await functions.deleteStammdaten(req.params.table, req.params.name);
    res.send(results);
  });

  app.get("/checkValue/:title/:value", async (req, res) => {

    var title = req.params.title;
    var value = req.params.value;
    var table;

    if (title == "name") {
      table = "artikel";
    }

    var autoFillResults = await functions.autoFill(title, table, value);

    res.send(autoFillResults);
  });

  app.get("/logs", async (req, res) => {
    if (req.session.loggedin) {
      var logs = await functions.getLog();
      res.render("logs", { result: logs, session: req.session });
    } else {
      res.redirect("/"); //redirect to home
    }

  });

  app.get("/logs/:artikelnummer", async (req, res) => {
    var logs = await functions.getLogByArtikelnummer(req.params.artikelnummer);
    res.render("logs", { result: logs, session: req.session });
  });

  app.delete("/entry/:id", async (req, res) => {
    //delete item
    console.log("delete request");
    if (req.session.loggedin) {
      try {
        const result = await functions.markEntryAsDeleteById(req.params.id, req.session.username);
        var log = await functions.log(req.params.id, "delete");

        res.send(result);
      } catch (err) {
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/");  //redirect to login page if not logged in
    }
    //log("Delete", id);
  });

  app.post("/create", async (req, res) => {
    //create entry in db

    var username = req.session.username;
    var fulldate = functions.getDate(); //get time/date
    var time = functions.getTime();

    try {
      const createItem = await functions.createItem(req.body.name, req.body.category, req.body.keywords);
      const item = await functions.getItemByName(req.body.name);
      const create = await functions.createEntry(
        item.id,
        req.body.number,
        req.body.minimum_number,
        req.body.location,
        username,
        username,
        fulldate,
        time
      );

      var x = await functions.getLatestEntry();

      var locationnum = await functions.incrementStammdatenNumber("ort", req.body.location); 
      var kategorienum = await functions.incrementStammdatenNumber("kategorie", req.body.category);
      var keywordnum = await functions.incrementStammdatenNumber("keywords", req.body.keywords);

      var log = await functions.log(x.id, "create");
      res.send("Entry Created");
    } catch (err) {
      console.log(err);
      console.log("entry error");
      res.status(500).send("Internal Server Error");
    }

  });


  app.patch("/entry", async (req, res) => {
    console.log("patch");
    console.log(req.body);


    try {
      const entry = await functions.getEntryById(req.body.id);
      var fulldate = functions.getDate(); //get time/date
      var time = functions.getTime();

      const updateItem = await functions.updateItem(req.body.name, req.body.category, req.body.keywords, entry.artikelid);

      const updateEntry = await functions.updateEntry(req.body.number, req.body.minimum_number, req.body.location, req.session.username, req.body.id);

      //update Stammdaten Number
      var keyworddenum = await functions.decrementStammdatenNumber("keywords", entry.keywords);
      var keywordnum = await functions.incrementStammdatenNumber("keywords", req.body.keywords);

      var locationdenum = await functions.decrementStammdatenNumber("ort", entry.location);
      var locationnum = await functions.incrementStammdatenNumber("ort", req.body.location);

      var categorydenum = await functions.decrementStammdatenNumber("kategorie", entry.category);
      var categorynum = await functions.incrementStammdatenNumber("kategorie", req.body.category);

      //add change log
      var log = await functions.log(req.body.id, "change");

      res.send("updated");
    } catch (e) {
      res.status(404).send(e);
    }
  });

}