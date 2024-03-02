const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi("7057095929:AAGm9bMsbtXWrLCHil5rji18644ylYXJbYg", {polling: true})
const admins = require('./assets/db/admins.json')
const { adminKeyboard } = require('./keyboard/keyboard')
const { createFile, deleteFile } = require('./logic')
const triggerWords = require('./assets/db/trigger.json')

bot.on('message', async msg => {
    let user = admins.find(user => user.username === msg.from.username)
    if (msg.text === '/start' && user.isAdmin){
       await bot.sendMessage(msg.chat.id, "привет админ вот что ты можешь сделать", adminKeyboard)
    }else if(msg.text in triggerWords && msg.chat.type === 'group'){
        bot.sendPhoto(msg.chat.id, "")
    }else{
        return;
    }
})

bot.on('callback_query', async msg => {
    if(msg.data === 'createTrigger'){
        createFile(bot, msg)
    }else if (msg.data === 'deleteTrigger'){
        deleteFile(bot, msg)
    }
})

bot.on('polling_error', console.log)