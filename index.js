require('dotenv').config({path: "./assets/modules/.env"})
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(process.env.devStatus ? process.env.TEST_TOKEN : process.env.DEFAULT_TOKEN, {polling: true})
const admins = require('./assets/db/admins.json')
const { adminKeyboard } = require('./keyboard/keyboard')
const { createFile, deleteFile, addPhotoToDatabase, sendRandomPhotoFromJson } = require('./logic')


bot.on('message', async msg => {
    if (msg.text && msg.text.trim() !== '') {
        if (msg.chat.type === 'group') {
            await sendRandomPhotoFromJson(bot, msg);
        }
    }
    let user = admins.filter(user => user.username === msg.from.username)
    if (msg.text === '/start' && user){
        await bot.sendMessage(msg.chat.id, "Привет админ вот что ты можешь сделать", adminKeyboard)
    }else if(msg.chat.type === 'group'){
        await sendRandomPhotoFromJson(bot, msg)
    }else{
        return;
    }
})

bot.on('callback_query', async msg => {
    if(msg.data === 'createTrigger'){
        createFile(bot, msg)
    }else if (msg.data === 'deleteTrigger'){
        deleteFile(bot, msg)
    }else if(msg.data === 'addImageToTrigger'){
        addPhotoToDatabase(bot, msg)
    }
})

bot.on('polling_error', console.log)