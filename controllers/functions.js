var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "inventur",
});

function getAll() {
    return new Promise((resolve, reject) => {
        var res = {"data":[]};
        con.query(
            `
            SELECT artikel.name, artikel.category, artikel.keywords, artikelliste.*, regal.regalname
            FROM artikelliste
            LEFT JOIN artikel ON artikel.id = artikelliste.artikelid
            LEFT JOIN regal ON regal.id = artikelliste.regalid
            WHERE artikelliste.deleted = false
            `,
            function (err, result) {
                //send results
                if (err) reject(err);
                res.data = result;
                resolve(res);
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
                if (err){
                    reject(err);
                    console.log(err);

                } 
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
                };
                resolve(result[0]);
            }
        );
    });
}

function createItem(name, category, keywords) {
    return new Promise((resolve, reject) => {
        con.query(
            "INSERT INTO artikel (name, category, keywords) VALUES (?, ?, ?)",
            [
                name,
                category,
                keywords,
            ],
            function (err, result) {
                if (err){
                    reject(err);
                    console.log(err);
                } 
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

async function getFullStammdaten(){
    var ort = await getStammdaten("ort");
    var kategorie = await getStammdaten("kategorie");
    var keywords = await getStammdaten("keywords");
    var res = {
        "ort": ort,
        "kategorie": kategorie,
        "keywords": keywords
    };
    return res;
}

function getStammdaten(table) {
    return new Promise((resolve, reject) => {
        var res = {"data":[]};
        con.query(
            `SELECT * FROM ${table}`,
            function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    res.data = result;
                    resolve(res);
                }

            }
        );
    });
}

function getStammdatenByName(table, name){
    return new Promise((resolve, reject) => {
        con.query(
            `SELECT * FROM ${table} WHERE ${table} = ? LIMIT 1`,
            [name],
            function (err, result) {
                if (err) reject(err);
                resolve(result[0]);
            }
        );
    }); 
}

async function getRaumAll(){
    var raum = await getRaum();

    return new Promise((resolve, reject) => {
        var res = {};
        var arr = [];
        con.query(
            `SELECT raum.id AS raumid, raum.raumname, regal.id AS regalid, regal.regalname, regal.fachanzahl  FROM regal LEFT JOIN raum ON regal.raumId = raum.id`,
            function (err, result) {
                if (err) reject(err);
                console.log(result.length);
                for(var i = 0; i < raum.length; i++){
                    arr = [];
                    for(var j = 0; j < result.length; j++){
                        if(raum[i].raumname == result[j].raumname){
                            arr.push(result[j]);    
                        }
                    }
                    res[raum[i].raumname] = arr;

        
                }
                console.log(res);
                resolve(res);
            }
        );
    });
}

/*
{
    "Keller": [
        {
            "regalid": 1,
            "regalname": "Regal1",
            "fachanzahl": 35
        },
        {
            ...
        }
    ]
}
*/

function getRaum(){
    return new Promise((resolve, reject) => {
        con.query(
            `SELECT * FROM raum`,
            function (err, result) {
                if (err) reject(err);
                console.log(result);
                resolve(result);
            }
        );
    });
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
                    console.log(err);
                } else {
                    resolve(result);
                }

            }
        );
    });
}

function saveStammdaten(table, value) {
    return new Promise((resolve, reject) => {
        con.query(
            'INSERT INTO ' + table + ' (' + table + ') VALUES ("' + value + '")',
            function (err, result) {
                if (err) {
                    reject(err)
                    console.log(err);

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
            con.query(`UPDATE ${table} SET number = number + 1 WHERE ${table} = ?`,
                [name[i]],
                function (err, result) {
                    if (err) {
                        reject(err);
                    }
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
                    }
                });
        }
        resolve("decremented");


    });
}

function deleteStammdaten(table, value) {
    return new Promise((resolve, reject) => {
        con.query(
            `DELETE FROM ${table} WHERE ${table} = ?`,
            [value],
            function (err, result) {
                if (err) {
                    reject(err)
                    console.log(err);
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
                    resolve(entry.object);
                });
            }
        });
    })
}

async function log(id, event) {
    var data = await getAllById(id);

    return new Promise((resolve, reject) => {
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
                    console.log(err);
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
                    console.log(err);
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
                }
                resolve(result);
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
                }
                resolve(result);
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
    updateItem,
    updateEntry,
    incrementStammdatenNumber,
    decrementStammdatenNumber,
    getKeywordsByName,
    autoFill,
    getEntryByName,
    getStammdatenByName,
    getFullStammdaten,
    getRaumAll
}