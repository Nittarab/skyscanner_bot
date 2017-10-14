const Telegraf = require('telegraf')
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
  bot.telegram.sendMessage(chat_id, data)
}


bot.on('location', (ctx) => {
  console.log(ctx.update.message.location)
  
  sendFlights(ctx.message.chat.id, "Barcellona is full of flights, we will notice you with the best")

 
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