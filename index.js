const database = require('./database');
const skyscannerBot = require('./skyscannerbot');


let airportList = [];



const init = () => {
  flightCollector();

  skyscannerBot.init();


};


const flightCollector = () => {

  database.getAllUserAirports()
    .then((airports) => {
      airports.forEach((airport) => {
        airportList.push(airport.iata_code);
      });
    })
    .catch((err) => {
      console.log('error', err);
    });
};



init();