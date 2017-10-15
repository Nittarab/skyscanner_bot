const Telegraf = require('telegraf');
const express = require('express');
const app = express();
const {
  Extra,
  Markup
} = require('telegraf');

const Database = require('./database');

const airports = [];
const user_language_code = 'en';

const intro_message = "Welcome to our bot, we will notify you all the flight under 30€ \n But first send to your position to select some departure airports";
const airports_message = "Select the airports that you will be notice";
const bot = new Telegraf('464972549:AAEUgiGOLnwJ277BWHtmkCd0up3rLCey5bI');



module.exports.init = () => {

  bot.use(Telegraf.log());

  bot.on('location', (ctx) => {
    let location = ctx.update.message.location;
    console.log(location);
    Database.getNearbyAirports(location.latitude, location.longitude).then(function (airports) {
      console.log(JSON.stringify(airports));
      selectAirport(ctx, airports, airports_message)

    }).catch(function (error) {
      console.log(error)
    })
    /* data = {
       "message": "Barcellona - Parigi 30€",
       "link": "https://www.skyscanner.net/transport_deeplink/4.0/UK/en-gb/GBP/vuel/1/9772.12404.2017-10-19/air/airli/flights?itinerary=flight%7C-31685%7C3540%7C9772%7C2017-10-19T07%3A00%7C12404%7C2017-10-19T08%3A00&carriers=-31685&operators=-31685&passengers=1&channel=website&cabin_class=economy&facilitated=false&ticket_price=22.52&is_npt=false&is_multipart=true&client_id=skyscanner_website&request_id=805e22f3-b878-4c80-b9fc-dcaf32e1a21b&commercial_filters=false&q_datetime_utc=2017-10-14T11%3A20%3A08&isbp=1&tabs=CombinedDayView&qid=9772-1710190700--31685-0-12404-1710190800%7C12404-1710260825--31915-0-9772-1710260930&sort=fqsscore&index=0&posidx=0&stops=0%2C0&pre_redirect_id=c3fc054f-1031-4bf0-8efb-daae120458c6"
     };*/
    //sendFlights(ctx.message.chat.id, data)
  });


  bot.command('respond_with_aereopots', (ctx) => {
    return ctx.reply('Keyboard wrap', Extra.markup(
      Markup.keyboard([aereoports[0], aereoports[1], aereoports[2]])
    ))
  });

  bot.command('/start', (ctx) => {
    chat_id = getChatId(ctx);
    console.log("chat id: " + chat_id);
    Database.userAirports(chat_id).then(function (userAirports) {
      if (userAirports[0] != null) getLocation(ctx, "Do you want to change your position?", "Change you location")
      else getLocation(ctx, intro_message, "Set location")
    })

  });

  /*
  bot.action(/.+/, (ctx) => {
    console.log("ahh")
    return ctx.answerCallbackQuery(`Oh, ${ctx.match[0]}! Great choise`)
  })*/

  bot.hears('✈️ ', ctx => ctx.reply('Yay!'));
  bot.startPolling();

  function getLocation(ctx, message, text) {
    return ctx.reply(message, Extra.markup((markup) => {
      return markup.resize()
        .keyboard([
          markup.locationRequestButton(text)
        ])
    }))
  }


  function selectAirport(ctx, airports, message) {
    getAirports(airports, ctx);
    return ctx.reply(message, Extra.markup((markup) => {
      return markup.resize()
        .keyboard([
          ['✈️ ' + airports[0].name, '✈️ ' + airports[1].name, '✈️ ' + airports[2].name],
          ['✈️ ' + airports[3].name, '✈️ ' + airports[4].name, '✈️ ' + airports[5].name],
          ['✈️ ' + airports[6].name, '✈️ ' + airports[7].name, '✈️ ' + airports[8].name],
        ])
    }))
  }

  function getAirports(airports, ctx) {
    airports.forEach(function (airport) {
      bot.hears('✈️ ' + airport.name, ctx => {
        console.log("\nsada" + airport.iata_code);
        Database.userAirports(chat_id).then(function (userAirports) {
          if (userAirports.map((a) => a.iata_code).includes(airport.iata_code)) bot.telegram.sendMessage(chat_id, "OLRADY HAVE THIS")
          else {
            Database.connectUserToAirport(getChatId(ctx), airport.iata_code).then(function (result) {
              if (userAirports[0] != null) bot.telegram.sendMessage(chat_id, airtportsToString(userAirports))
            })
          }
        })
      })
    })
  }

  function airtportsToString(userAirports) {
    s = "";
    userAirports.forEach(function (a) {
      s += a.nome + '\n'
    });
    return "Your airports are:" + s
  }

  function getChatId(ctx) {
    return ctx.update.message.chat.id
  }

};



module.exports.sendFlights = (chat_id, data) => {
  console.log(chat_id);

  const linkToFlight = Markup.inlineKeyboard([
    Markup.urlButton("book it", data.link),
  ]).extra();
  bot.telegram.sendMessage(chat_id, data.message, linkToFlight)
};

