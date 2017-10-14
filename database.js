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

class Database {

    userAlreadyExist(chat_id) {
        let result = connection.query("SELECT TOP 1 user.chat_id FROM users WHERE user.chat_id  = ?", chat_id)
        console.log(result)
        // TODO vedere com'è il result e ritornare di conseguenza
        // BOOLEAN

    }

    getUserIdFromChatId(chat_id) {
        return connection.query("SELECT user.id FROM users WHERE user.chat_id = ?", chat_id)
    }

    setUser(chat_id) {
        if (isUserAlreadyExist == false) {
            connection.query("INSERT INTO users(chat_id) values(?)", chat_id)
        }
    }

    getNearbyAirports(lat, long) {
        return connection.query()
    }

    connectUserToAirport(chat_id, airport_id) {

        connection.query("INSERT INTO users_airports(user_id, airport_id) values(?,?)", [getUserIdFromChatId, airport_id])
    }

    hasUserSetLocation(chat_id) {
        connection.query("SELECT user.id FORM users")

        // BOOLEAN
    }


    getFlights() {

        //TODO 

    }
}
module.exports = Database