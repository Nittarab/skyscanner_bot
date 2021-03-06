const moment = require('moment');
const rp = require('request-promise');
const _ = require('lodash');
const util = require('util');

const api_url = 'http://partners.api.skyscanner.net/apiservices';
const api_key = 'ha506416221846351184864905536865';


const validGoing = [];
const validReturn = [];

let validTravel = [];


module.exports.getFlight = (airport, callback) => {

  rp({
    uri: api_url + `/browsequotes/v1.0/ES/eur/es-ES/${airport}/anywhere/anytime`,
    qs: {
      apikey: api_key
    },
    json: true
  })
    .then(function (repos) {    // recupero tutte le andate
      let filtered = repos.Quotes.filter((obj) => {
        return (obj.Direct && obj.MinPrice < 30 )
      });

      if (filtered.length <= 0) throw new Error('Nessun volo di andata trovato');

      let inboundPromises = [];

      filtered.forEach((quote) => {
        let arriveAirport = repos.Places.find((place) => {
          return place.PlaceId === quote.OutboundLeg.DestinationId
        }).IataCode || 'not an airport';

        validGoing.push({
          from: airport,
          to: arriveAirport,
          departureDate: quote.OutboundLeg.DepartureDate,
          minPrice: quote.MinPrice
        });

        inboundPromises.push(rp({
          uri: api_url + `/browsequotes/v1.0/ES/eur/es-ES/${arriveAirport}/${airport}/anytime`,
          qs: {apikey: api_key},
          json: true
        }))
      });


      return inboundPromises;

    })
    .all().then((res) => {      // recupero tutti i ritorni fattibili

    const sessionsFlightsPromises = [];

    let filtered = res.filter((quote) => {
      return quote.Quotes.filter((quote) => {
        return quote.Direct && quote.MinPrice < 30
      })
    });
    filtered = flatQuote(filtered);

    if (filtered.length <= 0) throw new Error('Nessun volo di ritorno trovato');

    filtered.Quotes.forEach((quote) => {
      let arriveAirport = filtered.Places.find((place) => {
        return place.PlaceId === quote.OutboundLeg.OriginId
      }).IataCode || '';

      validReturn.push({
        from: arriveAirport,
        to: airport,
        departureDate: quote.OutboundLeg.DepartureDate,
        minPrice: quote.MinPrice
      });

    });

    validTravel = validateTravel(validGoing, validReturn);

    console.log('andata: ', validGoing);
    console.log('ritorno: ', validReturn);
    console.log('validi: ', validTravel);

    if (validTravel.length <= 0) throw new Error('Nessun volo trovato');


    validTravel.forEach((travel) => {

      sessionsFlightsPromises.push(rp({
        method: 'POST',
        uri: api_url + '/pricing/v1.0',
        headers: {
          'Cache-Control': 'no-cache'
        },
        form: {
          cabinclass: 'Economy',
          country: 'ES',
          currency: 'EUR',
          locale: 'es-ES',
          locationSchema: 'iata',
          originplace: travel.going.from,
          destinationplace: travel.going.to,
          outbounddate: moment(travel.going.departureDate).format('YYYY-MM-DD').toString(),     //[{"key":"outbounddate","value":"2017-11-30"}]
          inbounddate: moment(travel.return.departureDate).format('YYYY-MM-DD').toString(),
          adults: 1,
          children: 0,
          infants: 0,
          apikey: api_key
        },
        json: true,
        resolveWithFullResponse: true
      }));
    });
    console.log("sessionsflight: ", sessionsFlightsPromises.length);

    return sessionsFlightsPromises;
  })
    .all().then((response) => {

    const redirectPromises = [];


    response.forEach((res) => {

      console.log('location: ', res.headers.location);

      redirectPromises.push(
        rp({
          method: 'GET',
          uri: res.headers.location, // redirect link
          headers: {
            'Cache-Control': 'max-age=0'
          },
          qs: {
            apikey: api_key
          },
          json: true,
        }))
    });

    return redirectPromises;

  })
    .delay(20000)
    .all().then((travels) => {

      const flights = [];

      travels.forEach((travel) => {


        let outboundLeg = travel.Legs.find((leg) => (leg.Id === travel.Itineraries[0].OutboundLegId));
        let inboundLeg = travel.Legs.find((leg) => (leg.Id === travel.Itineraries[0].InboundLegId));

        let goingFromPlace = travel.Places.find((place) => {return (place.Id == travel.Query.OriginPlace)});
        let goingFrom = {
          iata: goingFromPlace.Code,
          name: goingFromPlace.Name
        };
        let goingToPlace = travel.Places.find((place) => {return (place.Id == travel.Query.DestinationPlace)});
        let goingTo = {
          iata: goingToPlace.Code,
          name: goingToPlace.Name
        };
        let returnFrom = goingTo;
        let returnTo = goingFrom;


        let res = {
          going: {
            from: goingFrom,
            to: goingTo,
            departure: outboundLeg.Departure,
            arrival: outboundLeg.Arrival,
            flightId: {
              flightNumber: outboundLeg.FlightNumbers[0].FlightNumber,
              carrierId: outboundLeg.FlightNumbers[0].CarrierId
            }
          },
          return: {
            from: returnFrom,
            to: returnTo,
            departure: inboundLeg.Departure,
            arrival: inboundLeg.Arrival,
            flightId: {
              flightNumber: inboundLeg.FlightNumbers[0].FlightNumber,
              carrierId: inboundLeg.FlightNumbers[0].CarrierId
            }
          },
          price: travel.Itineraries[0].PricingOptions[0].Price,
          link: travel.Itineraries[0].PricingOptions[0].DeeplinkUrl
        };

        flights.push(res);
      });

      console.log('----------------------------------------------------\n');

      callback(flights);
    })
    .catch(function (err) {
      console.log('error:', err)
    });

};


const validateTravel = (validGoing, validReturn) => {
  const validTravel = [];

  //tengo solo le andate dove corrisponde un ritorno
  validGoing.forEach((going) => {
    validReturn.forEach((ret) => {
      if (going.to === ret.from && validateDepartures(going.departureDate, ret.departureDate))
        validTravel.push({going: going, return: ret, minPrice: going.minPrice + ret.minPrice});
    })
  });

  return validTravel;

};


const validateDepartures = (dateGoing, dateReturn) => {
  const diffDays = moment(dateReturn).diff(moment(dateGoing), 'days');

  return (diffDays === 0 || diffDays === 1 || diffDays === 2 || diffDays === 3);
};

const flatQuote = (quotes) => {
  const res = {Quotes: [], Places: []};
  quotes.forEach((quote) => {
    quote.Quotes.forEach((q) => {
      res.Quotes.push(q);
    });

    quote.Places.forEach((p) => {
      res.Places.push(p);
    })
  });

  return res;
};