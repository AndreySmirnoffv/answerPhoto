const fs = require('fs');

async function createFile(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Введите слово, которое хотите добавить");

    bot.once('text', async (wordMsg) => {
        const word = wordMsg.text;
        await bot.sendMessage(msg.message.chat.id, "Теперь отправьте фотографию");

        // Обработчик для получения фотографии после получения слова
        bot.once('photo', async (photoMsg) => {
            const photo = photoMsg.photo[0];

            // Формируем объект с информацией о фотографии и слове
            const photoInfo = {
                file_id: photo.file_id,
                word: word
            };

            // Генерируем уникальное имя файла
            const formattedFileName = word.replace(/\s+(\w)(\w*)/g, function(_, first, rest) {
                return first.toUpperCase() + rest.toLowerCase();
            }) + ".json";

            // Создаем файл и записываем информацию о фотографии и слове
            fs.writeFile(formattedFileName, JSON.stringify(photoInfo, null, 2), async (err) => {
                if (err) {
                    console.error('Ошибка при создании файла:', err);
                    return;
                }
                console.log('Файл успешно создан:', formattedFileName);

                // Отправляем сообщение пользователю об успешном создании файла
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