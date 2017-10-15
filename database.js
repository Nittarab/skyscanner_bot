const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '35.158.224.38',
    user: 'barcellona',
    password: 'barcellona',
    database: 'barcellona'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

const db = {};
/*db.userAlreadyExist = function (chat_id) {

    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM users WHERE telegram_ID  = ?", [chat_id], function (error, result, fields) {
            if (error) reject(error);
            resolve(result.lenght > 0);
        });
    });
};*/

/*db.getUserIdFromChatId = function (chat_id) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT id FROM users WHERE telegram_ID = ?", chat_id, function (error, result, fields) {
            if (error) reject(error);
            resolve(result[0]);
        });
    })

}*/

/*db.setUser = function (chat_id) {
    connection.query("INSERT INTO users(telegram_ID) values(?)", chat_id)

}*/

db.getNearbyAirports = function (lat, long) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT name, iata_code, ( 3959 * acos( cos( radians(?) ) * cos( radians( latitude ) ) " +
            "* cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin(radians(latitude)) ) ) AS distance " +
            "FROM airports " +
            "ORDER BY DISTANCE " +
            "LIMIT 10", [lat, long, lat],
            function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            })
    });
};

db.connectUserToAirport = function (chat_id, iata_code) {
    console.log("iata_code:" + iata_code)
    return new Promise(function (resolve, reject) {
        connection.query("INSERT INTO users_airports(chat_id, iata_code) values(?,?)", [chat_id, iata_code], function (error, result, fields) {
            if (error) reject(error);
            console.log("insert into: ", result)
            resolve(result);
        })
    })
};

db.userAirports = function (user_id) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT users_airports.iata_code, airports.name  FROM users_airports INNER JOIN airports ON users_airports.iata_cose = airports.iata_code WHERE chat_id = ?", chat_id, function (error, result, fields) {
            if (error) reject(error);
            console.log("userlocation: ", JSON.stringify(result))
            resolve(result);
        })
    })



    // BOOLEAN
};

db.getAllUserAirports = function () {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT DISTINCT iata_code FROM users_airports", function (error, result, fields) {
            if (error) reject(error);
            console.log("users airport: ", JSON.stringify(result));
            resolve(result);
        })
    })
};

module.exports = db;