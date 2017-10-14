const rp = require('request-promise');
const api_url = 'http://partners.api.skyscanner.net/apiservices';
const api_key = 'ha506416221846351184864905536865';
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '35.158.224.38',
    user: 'barcellona',
    password: 'barcellona',
    database: 'barcellona'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

var db = {};
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
}
db.connectUserToAirport = function (chat_id, airport_id) {

    connection.query("INSERT INTO users_airports(chat_id, airport_id) values(?,?)", [chat_id, airport_id])
}

db.userLocations = function (user_id) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT iata_code FROM users_airports WHERE chat_id = ?", chat_id, function (error, result, fields) {
            if (error) reject(error);
            console.log("userlocation: ", JSON.stringify(result))
            resolve(result);
        })
    })



    // BOOLEAN
}


db.getFlights = function () {

    //TODO 

}

module.exports = db