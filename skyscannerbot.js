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

const intro_message = "Welcome to our bot, we will notify you all the flight \n But first send to your position to select some departure airports";
const airports_message = "Select the airports that you will be notice";
const bot = new Telegraf('464972549:AAEUgiGOLnwJ277BWHtmkCd0up3rLCey5bI');



module.exports.init = () => {

  // bot.use(Telegraf.log());

  bot.on('location', (ctx) => {
    let location = ctx.update.message.location;
    console.log(location);
    Database.getNearbyAirports(location.latitude, location.longitude).then(function (airports) {
      console.log(JSON.stringify(airports));
      selectAirport(ctx, airports, airports_message)

    }).catch(function (error) {
      console.log(error)
    })
  });


  bot.command('/start', (ctx) => {
    let chat_id = getChatId(ctx);
    console.log("chat id: " + chat_id);
    Database.userAirports(chat_id).then(function (userAirports) {
      if (userAirports[0] != null) {
        airtportsToString(userAirports);
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
          ['✈️ ' + airports[6].name, '✈️ ' + airports[7].name, '✈️ ' + airports[8].name],
          ['Done']
        ]);
    }))
  }

  function getAirports(airports, ctx) {
    let chat_id = getChatId(ctx);

    airports.forEach(function (airport) {
      bot.hears('✈️ ' + airport.name, ctx => {

        Database.userAirports(chat_id).then(function (userAirports) {
          if (userAirports.map((a) => a.iata_code).includes(airport.iata_code)) bot.telegram.sendMessage(chat_id, "You have already select this Airport");
          else {
            Database.connectUserToAirport(getChatId(ctx), airport.iata_code)
              .then(function (result) {
                userAirports.push({iata_code: airport.iata_code, name: airport.name});
                if (userAirports[0]) bot.telegram.sendMessage(chat_id, airtportsToString(userAirports))
              })
          }
        })
      });

    });
    bot.hears('Done', ctx => {
      console.log('ctx', ctx);

      bot.telegram.sendMessage(
        getChatId(ctx),
        'Done',
        JSON.stringify({
          hide_keyboard: true
        }));
    });

  }



  function airtportsToString(userAirports) {
    s = "";
    userAirports.forEach(function (a) {
      s += a.name + '\n'
    });
    return "Your airports are: \n" + s;
  }

  function getChatId(ctx) {
    return ctx.update.message.chat.id
  }

};


module.exports.sendFlightToAll = function (data) {


  console.log('data: ', data);

  let message = `${data.going.from.name} - ${data.going.to.name} ${data.price}€ `;

  Database.getUsersInterestedInAirport(data.going.from.iata)
    .then((users) => {

      console.log('users: ', users);

      users.forEach((user) => {
        sendFlightToUser({link: data.link, message: message}, user.chat_id);
      })

    })
    .catch((err) => {
      console.log('getUsersInterestedInAirport', err);
    })
};


function sendFlightToUser(data, chat_id) {

  const linkToFlight = Markup.inlineKeyboard([
    Markup.urlButton("Book it", data.link),
  ]).extra();
  bot.telegram.sendMessage(chat_id, data.message, linkToFlight)
};