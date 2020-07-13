var mysql = require("mysql");
var ldap = require("ldapjs");
var functions = require("./functions.js");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventur",
});

var client = ldap.createClient({
  url: "ldap://bbw-azubi.local", //domain
});
client.on("error", function (err) {
  console.warn(
    "LDAP connection failed, but fear not, it will reconnect OK",
    err
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
      res.render("login", { err: req.query.err }); //redirect to login page if not logged in
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
        LEFT JOIN artikel ON artikel.id = artikelliste.artikelid
        WHERE `;

      Object.keys(req.query).forEach(function (key) {
        //build WHERE clause with get params
        key = key.replace(/['"`]+/g, "");
        req.query[key] = req.query[key].replace(/['"`]+/g, "");

        if (key == "id") {
          newKey = "artikelliste." + key;
          sql += `${newKey} = ${req.query[key]} AND `;
        } else {
          sql += key + " = '" + req.query[key] + "' AND ";
        }
      });

      if (Object.keys(req.query).length === 0) {
        sql = sql.substring(0, sql.length - 7); //cut 'WHERE'
      } else {
        sql = sql.substring(0, sql.length - 5); //cut last 'AND'
      }

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

  app.get("/entry/:id", async (req, res) => {
    try {
      const result = await functions.getEntryById(req.params.id);

      res.send(result);
    } catch (err) {
      res.status(404).send("Internal Server Error");
    }
  });

  app.post("/auth", async (req, res) => {
    //authentication
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

  app.get("/stammdaten/:value", async (req, res) => {
    try {
      var results = await functions.getStammdaten(req.params.value);
      res.render("stammdaten", { result: results, session: req.session });
    } catch (e) {
      res.status(404).send("404 Not Found");
      console.log(e);
    }

  });

  app.post("/stammdaten/:table", async (req, res) => {
    console.log(req.params.table);
    console.log(req.body.value);
    if (req.params.table == "Stichwörter") {
      console.log("changeeeeeeeeeeeeeeeee");
      req.params.table = "keywords";
    }
    var results = await functions.saveStammdaten(req.params.table.toLowerCase(), req.body.value);
    res.send("Entry Created");
  });

  app.delete("/stammdaten/:table/:id", async (req, res) => {
    console.log(req.params.table);
    console.log(req.params.id);
    var results = await functions.deleteStammdaten(req.params.table, req.params.id);
    res.send(results);
  });

  app.get("/checkValue/:title/:value", function (req, res) {

    var title = req.params.title;
    var value = req.params.value;
    var table;

    if (title == "name") {
      table = "artikel";
    } else if (title == "location") {
      table = "artikelliste";
    }

    var sql = `SELECT DISTINCT ${title} FROM ${table}`; //get all locations from artikelliste

    con.query(sql, function (err, result) {
      if (err) {
        res.status(404).send("404 Not Found");
      } else {
        var autoFillResults = [];
        for (var i = 0; i < result.length; i++) {
          var sqlRes = result[i][title].toUpperCase();
          var val = value.toUpperCase();
          if (sqlRes.startsWith(val)) {
            //if a location starts with the user input
            autoFillResults.push(result[i][title]); //add location to autoFillResults
          }
        }

        res.send(autoFillResults);
      }

    });
  });

  app.get("/logs", async (req, res) => {
    var logs = await functions.getLog();
    res.render("logs", { result: logs, session: req.session });
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
    var sql =
      "INSERT INTO artikel (name, category, keywords) VALUES ('" +
      req.body.name +
      "', '" +
      req.body.category +
      "', '" +
      req.body.keywords +
      "')";
    con.query(sql, async (err, result) => {
      //create item in 'artikel' list
      if (err) {
        res.status(500).send("Internal Server Error");
      } else {
        console.log("1 article inserted");

        var fulldate = functions.getDate(); //get time/date
        var time = functions.getTime();

        try {
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
          var log = await functions.log(x.id, "create");
          res.send("Entry Created");
        } catch (err) {
          console.log(err);
          console.log("entry error");
          res.status(500).send("Internal Server Error");
        }
      }
    });

  });

  app.patch("/entry", async (req, res) => {
    console.log("patch");
    console.log(req.body);
    try {
      const entry = await functions.getEntryById(req.body.id);

      var fulldate = functions.getDate(); //get time/date
      var time = functions.getTime();

      //update item in 'artikel'
      var sqlArtikel =
        "UPDATE artikel SET name = '" +
        req.body.name +
        "', category = '" +
        req.body.category +
        "', keywords = '" +
        req.body.keywords +
        "' WHERE id= '" +
        entry.artikelid +
        "'";

      con.query(sqlArtikel, function (err, result) {
        if (err) {
          res.status(500).send("Internal Server Error");
        }
        console.log("1 artikel updated");
      });

      //update item in 'artikelliste'
      var sqlArtikelliste =
        "UPDATE artikelliste SET number = '" +
        req.body.number +
        "', minimum_number = '" +
        req.body.minimum_number +
        "', change_by = '" +
        req.session.username +
        "', date = '" +
        fulldate +
        "', time = '" +
        time +
        "', deleted = '0'" +
        " WHERE id = '" +
        req.body.id +
        "'";
      con.query(sqlArtikelliste, async (err, result) => {
        if (err) {
          res.status(500).send("Internal Server Error");
        }
        console.log("1 entry updated");
        var log = await functions.log(req.body.id, "change");

      });
      res.send("updated");
    } catch (e) {
      res.status(404).send(e);
    }
  });

}