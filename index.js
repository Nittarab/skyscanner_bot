const database = require('./database');
const skyscannerBot = require('./skyscannerbot');
const flightFinder = require('./flightFinder');

let airportList = [];



const init = () => {

  skyscannerBot.init();


  //flightCollector();


  flightFinder.getFlight('BCN', (travels) => {
      console.log('cal back');

      console.log('viaggi: ', travels);

      travels.forEach((travel) => {
        skyscannerBot.sendFlightToAll(travel);
      });

  });

  process.on("unhandledRejection", function(reason, promise) {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~', reason);
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