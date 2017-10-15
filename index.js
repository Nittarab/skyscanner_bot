const database = require('./database');
const skyscannerBot = require('./skyscannerbot');
const flightFinder = require('./flightFinder');

let airportList = [];



const init = () => {

  skyscannerBot.init();
  flightCollector();

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