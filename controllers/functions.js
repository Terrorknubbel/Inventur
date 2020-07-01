var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "inventur",
});

function getAll() {
    return new Promise((resolve, reject) => {
        con.query(
            "SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.* FROM artikelliste LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE deleted = false",
            function (err, result) {
                //send results
                if (err) reject(err);
                resolve(result);
            }
        );
    });
}

function getEntryById(id) {
    return new Promise((resolve, reject) => {
        con.query(
            `SELECT
              artikel.name,
              artikel.category,
              artikel.keywords,
              artikelliste.*
          FROM artikelliste
          LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE artikelliste.id = ? LIMIT 1
          `,
            [id],
            function (err, result) {
                if (err) reject(err);
                resolve(result[0]);
            }
        );
    });
}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM artikel WHERE id = ? LIMIT 1", [id], function (
            err,
            result
        ) {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
}

function getItemByName(Name) {
    return new Promise((resolve, reject) => {
        con.query(
            "SELECT * FROM artikel WHERE name = ? LIMIT 1",
            [Name],
            function (err, result) {
                if (err) reject(err);
                resolve(result[0]);
            }
        );
    });
}

function markEntryAsDeleteById(id) {
    return new Promise((resolve, reject) => {
        con.query(
            "UPDATE artikelliste SET deleted = true WHERE id = ?",
            [id],
            function (err, result) {
                if (err) reject(err);
                resolve(result[0]);
            }
        );
    });
}

function createEntry(artikelid, number, minimum_number, location, creator, change_by, date, time) {
    console.log("create Entry function");
    return new Promise((resolve, reject) => {
        con.query(
            `INSERT INTO artikelliste 
        (
          artikelid,
          number,
          minimum_number,
          location,
          creator,
          change_by,
          date,
          time
        )
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                artikelid,
                number,
                minimum_number,
                location,
                creator,
                change_by,
                date,
                time,
            ],
            function (err, result) {
                if (err) reject(err);
                console.log(result);
                console.log(err);
                resolve(result);
            }
        );
    });
}

function createItem() {
    console.log("create Entry function");
    return new Promise((resolve, reject) => {
        con.query(
            "INSERT INTO artikelliste (artikelid, number, minimum_number, location, creator, change_by, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                artikelid,
                number,
                minimum_number,
                location,
                creator,
                change_by,
                date,
                time,
            ],
            function (err, result) {
                if (err) reject(err);
                console.log(result);
                console.log(err);
                resolve(result);
            }
        );
    });
}
function getDate() {
    var d = new Date();
    var date = d.getUTCDate();
    var month = d.getUTCMonth();
    month += 1;
    var year = d.getUTCFullYear();

    if (date <= 9) {
        date = "0" + date;
    }
    if (month <= 9) {
        month = "0" + month;
    }

    var fulldate = date + "." + month + "." + year;

    return fulldate;
}

function getTime() {
    var d = new Date();

    var hours = d.getHours();
    var minutes = d.getMinutes();

    if (hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes <= 9) {
        minutes = "0" + minutes;
    }

    var time = hours + ":" + minutes;

    return time;
}

function getStammdaten(name) {
    return new Promise((resolve, reject) => {
        con.query(
            `SELECT
              ${name}
          FROM ${name}`,
            function (err, result) {
                if (err) reject(err);

                var array = [];
                for (var i = 0; i < result.length; i++) {
                    for (const [key, value] of Object.entries(result[i])) {
                        array.push(result[i][`${key}`]);
                    }
                }

                resolve(array);
            }
        );
    });
}

function UserSearch(client, base, search_options) {
    return new Promise(function (resolve, reject) {

        client.search(base, search_options, function (err, resSearch) {
            if (err) {
                console.log('Error occurred while ldap search');
            } else {
                resSearch.on('searchEntry', function (entry) {
                    //console.log('Entry', JSON.stringify(entry.object));
                    // console.log(entry.object.title);
                    // test = entry.object.title;
                    resolve(entry.object);
                });
            }
        });
    })
}

module.exports = {
    getAll,
    getEntryById,
    getItemById,
    getItemByName,
    markEntryAsDeleteById,
    createEntry,
    createItem,
    getDate,
    getTime,
    UserSearch,
    getStammdaten
}