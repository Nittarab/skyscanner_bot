const Telegraf = require('telegraf')
const express = require('express')
const app = express()

const {
  Extra,
  Markup
} = require('telegraf')
const bot = new Telegraf('464972549:AAEUgiGOLnwJ277BWHtmkCd0up3rLCey5bI')
const place_api = 'AIzaSyAjZIef4CunICqGv5yOA0yMvsWnrUNVeOw'

const aereoports = []
const user_language_code = 'en'

intro_message = "Welcome to our bot, we will notify you all the flight under 30€ \n But first send to your position to select some departure airports"

bot.use(Telegraf.log())


function sendFlights(chat_id, data){
  console.log(chat_id) 
  
  const linkToFlight = Markup.inlineKeyboard([
    Markup.urlButton("book it",data.link),
  ]).extra()

  bot.telegram.sendMessage(chat_id, data.message, linkToFlight)
}


bot.on('location', (ctx) => {
  console.log(ctx.update.message.location)
  data = {
    "message":"Barcellona - Parigi 30€",
    "link":"https://www.skyscanner.net/transport_deeplink/4.0/UK/en-gb/GBP/vuel/1/9772.12404.2017-10-19/air/airli/flights?itinerary=flight%7C-31685%7C3540%7C9772%7C2017-10-19T07%3A00%7C12404%7C2017-10-19T08%3A00&carriers=-31685&operators=-31685&passengers=1&channel=website&cabin_class=economy&facilitated=false&ticket_price=22.52&is_npt=false&is_multipart=true&client_id=skyscanner_website&request_id=805e22f3-b878-4c80-b9fc-dcaf32e1a21b&commercial_filters=false&q_datetime_utc=2017-10-14T11%3A20%3A08&isbp=1&tabs=CombinedDayView&qid=9772-1710190700--31685-0-12404-1710190800%7C12404-1710260825--31915-0-9772-1710260930&sort=fqsscore&index=0&posidx=0&stops=0%2C0&pre_redirect_id=c3fc054f-1031-4bf0-8efb-daae120458c6"
  };
  sendFlights(ctx.message.chat.id,data )

 
})


bot.command('respond_with_aereopots', (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard([aereoports[0], aereoports[1], aereoports[2]])
  ))
})

bot.command('/start', (ctx) => {
  return ctx.reply(intro_message, Extra.markup((markup) => {
    return markup.resize()
      .keyboard([
        markup.locationRequestButton('Send location')
      ])
  }))
})



/*bot.action(/.+/, (ctx) => {
  return ctx.answerCallbackQuery(`Oh, ${ctx.match[0]}! Great choise`)
})*/



bot.startPolling()