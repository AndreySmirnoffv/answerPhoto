const fs = require('fs');

async function createFile(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Введите слово, которое хотите добавить");

    bot.once('text', async (wordMsg) => {
        const word = wordMsg.text;
        await bot.sendMessage(msg.message.chat.id, "Теперь отправьте фотографию");

        bot.once('photo', async (photoMsg) => {
            const photo = photoMsg.photo[0];

            const photoInfo = {
                file_id: photo.file_id,
                word: word
            };

            const formattedFileName = word.replace(/\s+(\w)(\w*)/g, function(_, first, rest) {
                return first.toUpperCase() + rest.toLowerCase();
            }) + ".json";

            fs.writeFile(formattedFileName, JSON.stringify(photoInfo, null, '\t'), async (err) => {
                if (err) {
                    console.error('Ошибка при создании файла:', err);
                    return;
                }
                console.log('Файл успешно создан:', formattedFileName);

                await bot.sendMessage(msg.message.chat.id, 'Файл успешно создан: ' + formattedFileName);
            });
        });
    });
}

async function deleteFile(bot, msg){
    await bot.sendMessage(msg.chat.id, "Введите слово которое хотите удалить")
}
module.exports = {
    createFile: createFile
}