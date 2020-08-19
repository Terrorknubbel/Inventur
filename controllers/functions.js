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

function getAllById(id) {
    return new Promise((resolve, reject) => {
        con.query(
            `SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.* FROM artikelliste LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE artikelliste.id = ${id}`,
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

function getEntryByName(Name){
    return new Promise((resolve, reject) => {
        con.query(
            `SELECT
            artikel.name
        FROM artikelliste
        LEFT JOIN artikel ON artikel.id = artikelliste.artikelid WHERE artikelliste.deleted = 0 AND artikel.name = ?  LIMIT 1`,
            [Name],
            function (err, result) {
                console.log(err);
                if (err) reject(err);
                resolve(result[0]);
            }
        );
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

function markEntryAsDeleteById(id, username) {
    return new Promise((resolve, reject) => {
        var date = getDate();
        var time = getTime();
        con.query(
            "UPDATE artikelliste SET date = ?, time = ?, change_by = ?, deleted = true WHERE id = ?",
            [date, time, username, id],
            function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                }
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

function getLatestEntry() {
    return new Promise((resolve, reject) => {
        con.query(
            "SELECT * FROM `artikelliste` ORDER BY id DESC LIMIT 1",
            function (err, result) {
                if (err) {
                    reject(err)
                    console.log(err);
                    console.log("getLatestEntry error");
                };
                resolve(result[0]);
            }
        );
    });
}

function createItem(name, category, keywords) {
    console.log("create Entry function");
    return new Promise((resolve, reject) => {
        con.query(
            "INSERT INTO artikel (name, category, keywords) VALUES (?, ?, ?)",
            [
                name,
                category,
                keywords,
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

async function getStammdaten() {
    var ort = await getOrt();
    var kategorie = await getKategorie();
    var keywords = await getKeywords();
    var res = {
        "ort": ort,
        "kategorie": kategorie,
        "keywords": keywords
    };
    //console.log("res: " + JSON.stringify(res));
    return res;

}

function autoFill(title, table, value){
    return new Promise((resolve, reject) => {
        con.query(
            `SELECT DISTINCT ${title} FROM ${table}`,
            function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
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
                    resolve(autoFillResults);
                    console.log(autoFillResults);
                }
            }
        );
    });
}

function getKeywordsByName(name) {
    return new Promise((resolve, reject) => {
        con.query(
            `SELECT * FROM keywords WHERE keywords = ?`,
            [name],
            function (err, result) {
                if (err) {
                    reject(err)
                    console.log("Cant get keywords");
                } else {
                    resolve(result);
                }

            }
        );
    });
}

function saveStammdaten(table, value) {
    return new Promise((resolve, reject) => {
        console.log(table, value);
        con.query(
            'INSERT INTO ' + table + ' (' + table + ') VALUES ("' + value + '")',
            function (err, result) {
                if (err) {
                    //reject(err)
                    console.log("---------");
                    console.log("Cant save Stammdaten");
                    console.log(err);
                    console.log("---------");
                } else {
                    resolve(result);

                }

            }
        );
    });
}

function incrementStammdatenNumber(table, name) {
    return new Promise((resolve, reject) => {
        name = name.split(",");
        for (var i = 0; i < name.length; i++) {
            let sql = `UPDATE ${table} SET number = number + 1 WHERE ${table} = "${name[i]}"`;
            console.log(sql);
            con.query(`UPDATE ${table} SET number = number + 1 WHERE ${table} = ?`,
                [name[i]],
                function (err, result) {
                    if (err) {
                        reject(err);
                        console.log(err);
                        console.log("increment Stammdaten error");
                    }
                    console.log(result);
                });
        }
        resolve("incremented");


    });
}

function decrementStammdatenNumber(table, name) {
    return new Promise((resolve, reject) => {
        name = name.split(",");
        for (var i = 0; i < name.length; i++) {
            con.query(`UPDATE ${table} SET number = number - 1 WHERE ${table} = ?`,
                [name[i]],
                function (err, result) {
                    if (err) {
                        reject(err);
                        console.log(err);
                        console.log("decrement Stammdaten error");
                    }
                    console.log(result);

                });
        }
        resolve("decremented");


    });
}

function deleteStammdaten(table, value) {
    return new Promise((resolve, reject) => {
        console.log(table, value);
        con.query(
            `DELETE FROM ${table} WHERE keywords = ?`,
            [value],
            function (err, result) {
                if (err) {
                    reject(err)
                    console.log("---------");
                    console.log("Cant delete Stammdaten");
                    console.log(err);
                    console.log("---------");
                } else {
                    resolve(result);

                }

            }
        );
    });
}

function getOrt() {
    return new Promise((resolve, reject) => {
        var res = {};
        con.query(
            `SELECT * FROM ort`,
            function (err, result) {
                if (err) {
                    reject(err);
                    console.log("Cant get Ort");
                } else {
                    resolve(result);
                }

            }
        );
    });
}

function getKategorie() {
    return new Promise((resolve, reject) => {
        var res = {};
        con.query(
            `SELECT * FROM kategorie`,
            function (err, result) {
                if (err) {
                    reject(err)
                    console.log("Cant get Kategorie");
                } else {
                    resolve(result);
                }

            }
        );
    });
}

function getKeywords() {
    return new Promise((resolve, reject) => {
        var res = {};
        con.query(
            `SELECT * FROM keywords`,
            function (err, result) {
                if (err) {
                    reject(err)
                    console.log("Cant get keywords");
                } else {
                    resolve(result);
                }

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

async function log(id, event) {
    var data = await getAllById(id);

    return new Promise((resolve, reject) => {
        console.log("----");
        console.log(data);
        console.log("----");

        con.query(
            "INSERT INTO `log`(`event`, `artikelnummer`, `name`, `category`, `keywords`, `location`, `date`, `time`, `creator`, `change_by`, `number`, `minimum_number`, `deleted`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [event, data[0].id, data[0].name, data[0].category, data[0].keywords, data[0].location, data[0].date, data[0].time, data[0].creator, data[0].change_by, data[0].number, data[0].minimum_number, data[0].deleted],
            function (err, result) {
                //send results
                if (err) {
                    reject(err);
                    console.log(err);
                };
                resolve(result);
            }
        );
    });
}

function getLog() {
    return new Promise((resolve, reject) => {
        con.query(
            "SELECT * FROM `log`",
            function (err, result) {
                //send results
                if (err) {
                    reject(err);
                    console.log("getLog error");
                }
                resolve(result);
            }
        );
    });
}

function getLogByArtikelnummer(artikelnummer) {
    return new Promise((resolve, reject) => {
        con.query(
            "SELECT * FROM `log` WHERE artikelnummer = ?", [artikelnummer],
            function (err, result) {
                //send results
                if (err) {
                    reject(err);
                    console.log("getLog error");
                }
                resolve(result);
            }
        );
    });
}

function updateItem(name, category, keywords, artikelId) {
    return new Promise((resolve, reject) => {

        con.query(`UPDATE artikel SET name = ?, category = ?, keywords = ? WHERE id = ?`,
            [name, category, keywords, artikelId],
            function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                    console.log("update item error");
                }
                resolve(result);
                console.log("1 artikel updated");
            });
    });
}

function updateEntry(number, minimum_number, location_update, username, id) {
    return new Promise((resolve, reject) => {
        con.query("UPDATE artikelliste SET number = ?, minimum_number = ?, location = ?, change_by = ?, date = ?, time = ?, deleted = 0 WHERE id = ?",
            [number, minimum_number, location_update, username, getDate(), getTime(), id],
            function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                    console.log("entry update error");
                }
                resolve(result);
                console.log("1 entry updated");

            });
    });
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
    getStammdaten,
    saveStammdaten,
    deleteStammdaten,
    log,
    getAllById,
    getLog,
    getLatestEntry,
    getLogByArtikelnummer,
    getKategorie,
    getOrt,
    getKeywords,
    updateItem,
    updateEntry,
    incrementStammdatenNumber,
    decrementStammdatenNumber,
    getKeywordsByName,
    autoFill,
    getEntryByName
}