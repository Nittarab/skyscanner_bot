const database = require('./database');
const skyscannerBot = require('./skyscannerbot');
const flightFinder = require('./flightFinder');

let airportList = [];



const init = () => {

  //skyscannerBot.init();

  //flightCollector();
  flightFinder.getFlight('BCN', (travels) => {


      console.log('viaggi: ', travels);
  });

  process.on("unhandledRejection", function(reason, promise) {
    console.log('dio boi dio ', reason);
    // See Promise.onPossiblyUnhandledRejection for parameter documentation
  });
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