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

  // bot.use(Telegraf.log());

  bot.on('location', (ctx) => {
    location = ctx.update.message.location;
    console.log(location);
    Database.getNearbyAirports(location.latitude, location.longitude).then(function (airports) {
      console.log(JSON.stringify(airports));
      selectAirport(ctx, airports, airports_message)

    }).catch(function (error) {
      console.log(error)
    })
  });


  bot.command('/start', (ctx) => {
    chat_id =
      (ctx);
    console.log("chat id: " + chat_id);
    Database.userAirports(chat_id).then(function (userAirports) {
      if (userAirports[0] != null) {
        airtportsToString(userAirports)
        getLocation(ctx, "Do you want to change your position?", "Change you location")

      } else getLocation(ctx, intro_message, "Set location")
    })
  });

  /*bot.hears('Done', ctx => {
    bot.telegram.sendMessage(
      (ctx),'Thank you, notification about flights will arrive soon',  hide_keyboard: true ) })
      */
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
          ['✈️ ' + airports[6].name, '✈️ ' + airports[7].name, '✈️ ' + airports[8].name]
          //['Done']
        ])
    }))
  }

  function getAirports(airports, ctx) {
    airports.forEach(function (airport) {
      bot.hears('✈️ ' + airport.name, ctx => {
        console.log("\nsada" + airport.iata_code);
        Database.userAirports(chat_id).then(function (userAirports) {
          if (userAirports.map((a) => a.iata_code).includes(airport.iata_code)) bot.telegram.sendMessage(chat_id, "you have already select this Airport")
          else {
            Database.connectUserToAirport(
              (ctx), airport.iata_code).then(function (result) {
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
      s += a.name + '\n'
    });
    return "Your airports are:" + s
  }

  function (ctx) {
    return ctx.update.message.chat.id
  }

};


module.exports.sendFlightToAll = function (data) {


  data.message = "There is a Flight from: barca is adsada "
  // TODO sistemare la creazione del messaggio 

  Database.getUsersInterestedInAirport(data.going.from.iata)
    .then((users) => {
      users.forEach((user) => {
        sendFlightToUser(data, user);
      })
    })
}


function sendFlightToUser(data, chat_id) {

  const linkToFlight = Markup.inlineKeyboard([
    Markup.urlButton("book it", data.link),
  ]).extra();
  bot.telegram.sendMessage(chat_id, data.message, linkToFlight)
};