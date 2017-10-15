const database = require('./database');
const skyscannerBot = require('./skyscannerbot');
const flightFinder = require('./flightFinder');

let airportList = [];



const init = () => {

    skyscannerBot.init();
skyscannerBot.sendFlightToAll({ going: 
     { from: {iata:'BCN'},
       to: 'RTM',
       departure: '2018-02-08T14:10:00',
       arrival: '2018-02-08T16:25:00',
       flightId: [Object] },
    return: 
     { from: {iata:'RTM'},
       to: 'BCN',
       departure: '2018-02-11T11:50:00',
       arrival: '2018-02-11T13:50:00',
       flightId: [Object] },
    price: 54,
    link: 'http://partners.api.skyscanner.net/apiservices/deeplink/v2?_cje=wo3VeFUbH4ccUyryPafkB6qYjsZnm4xRWxs1Bj7jembvFa3YN6VV6vlIUDjRov7I&url=http%3a%2f%2fwww.apideeplink.com%2ftransport_deeplink%2f4.0%2fES%2fes-es%2fEUR%2fbasi%2f2%2f9772.16019.2018-02-08%2c16019.9772.2018-02-11%2fair%2fairli%2fflights%3fitinerary%3dflight%7c-31748%7c6062%7c9772%7c2018-02-08T14%3a10%7c16019%7c2018-02-08T16%3a25%2cflight%7c-31748%7c6061%7c16019%7c2018-02-11T11%3a50%7c9772%7c2018-02-11T13%3a50%26carriers%3d-31748%26operators%3d-31748%2c-31748%26passengers%3d1%26channel%3ddataapi%26cabin_class%3deconomy%26facilitated%3dfalse%26ticket_price%3d54.00%26is_npt%3dfalse%26is_multipart%3dfalse%26client_id%3dskyscanner_b2b%26request_id%3db04d5930-acbc-462c-828f-afc099d25ddd%26commercial_filters%3dfalse%26q_datetime_utc%3d2017-10-14T17%3a38%3a46' } )


  // skyscannerBot.init();

  //flightCollector();
  // flightFinder.getFlight('BCN', (travels) => {


  //     console.log('viaggi: ', travels);
  // });
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