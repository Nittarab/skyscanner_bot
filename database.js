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
db.userAlreadyExist = function (chat_id) {
     connection.query("SELECT count * FROM users WHERE telegram_ID  = ?", [chat_id],)
      console.log( "aaa: ", result)
    // TODO vedere com'è il result e ritornare di conseguenza
    // BOOLEAN
};

db.getUserIdFromChatId = function (chat_id) {
    return connection.query("SELECT users.id FROM users WHERE users.telegram_ID = ?", chat_id)
}

db.setUser = function (chat_id) {
    if (db.userAlreadyExist(chat_id) == false) {
        connection.query("INSERT INTO users(telegram_ID) values(?)", chat_id)
    }
}

db.getNearbyAirports = function (lat, long) {
    return connection.query()
}

db.connectUserToAirport = function (chat_id, airport_id) {

    connection.query("INSERT INTO users_airports(user_id, airport_id) values(?,?)", [getUserIdFromChatId, airport_id])
}

db.hasUserSetLocation = function (chat_id) {
    connection.query("SELECT user.id FORM users")

    // BOOLEAN
}


db.getFlights = function () {

    //TODO 

}

module.exports = db