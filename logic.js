const fs = require('fs');
const path = require('path');

async function createFile(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Введите слово, которое хотите добавить");

    bot.once('text', async (wordMsg) => {
        const word = wordMsg.text;
        await bot.sendMessage(msg.message.chat.id, "Теперь отправьте фотографию");

        bot.once('photo', async (photoMsg) => {
            const photo = photoMsg.photo[0];
            const photoInfo = {
                photos: [{ file_id: photo.file_id }],
            };

            const formattedFileName = word.replace(/\s+(\w)(\w*)/g, function(_, first, rest) {
                return first.toLowerCase() + rest.toLowerCase();
            }) + ".json";

            fs.writeFile('./assets/db/photos/' + formattedFileName, JSON.stringify(photoInfo, null, '\t'), async (err) => {
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

async function addPhotoToDatabase(bot, msg) {
    try {
        await bot.sendMessage(msg.message.chat.id, "Пришли мне слово");

        // Ждем сообщения с текстом (словом)
        bot.once('text', async (wordMsg) => {
            try {
                const word = wordMsg.text.toLowerCase().trim(); // Приводим слово к нижнему регистру и удаляем лишние пробелы
                const fileName = word.replace(/\s+(\w)(\w*)/g, function(_, first, rest) {
                    return first.toLowerCase() + rest.toLowerCase();
                }) + ".json";

                // Проверяем существование файла
                if (fs.existsSync('./assets/db/photos/' + fileName)) {
                    // Отправляем запрос на отправку фотографии
                    await bot.sendMessage(msg.message.chat.id, 'Теперь отправьте фотографию, которую хотите добавить к слову.');
                    
                    // Ждем сообщения с фотографией
                    bot.once('photo', async (photoMsg) => {
                        try {
                            const photo = photoMsg.photo[0]; // Получаем первую фотографию из сообщения

                            // Загружаем существующий JSON файл
                            let existingData = {};
                            try {
                                existingData = JSON.parse(fs.readFileSync('./assets/db/photos/' + fileName));
                            } catch (error) {
                                console.error('Ошибка при чтении файла:', error);
                                await bot.sendMessage(msg.chat.id, 'Произошла ошибка при чтении файла.');
                                return;
                            }

                            // Добавляем фотографию в массив фотографий
                            existingData.photos = existingData.photos || [];
                            existingData.photos.push({ file_id: photo.file_id });

                            // Записываем обновленные данные обратно в файл
                            fs.writeFile('./assets/db/photos/' + fileName, JSON.stringify(existingData, null, '\t'), async (err) => {
                                if (err) {
                                    console.error('Ошибка при добавлении фото в файл:', err);
                                    await bot.sendMessage(msg.chat.id, 'Произошла ошибка при добавлении фотографии в базу данных.');
                                    return;
                                }
                                console.log('Фотография успешно добавлена к слову:', word);
                                await bot.sendMessage(msg.message.chat.id, 'Фотография успешно добавлена к слову: ' + word);
                            });
                        } catch (error) {
                            console.error('Ошибка в обработчике фотографии:', error);
                        }
                    });
                } else {
                    // Если файл не найден, отправляем сообщение об ошибке
                    await bot.sendMessage(msg.message.chat.id, `Файл для слова "${word}" не найден. Пожалуйста, сначала добавьте это слово в базу данных.`);
                }
            } catch (error) {
                console.error('Ошибка в обработчике текстового сообщения:', error);
            }
        });
    } catch (error) {
        console.error('Ошибка в функции addPhotoToDatabase:', error);
    }
}



async function deleteFile(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Введите слово, файл с которым нужно удалить");

    bot.once('text', async (wordMsg) => {
        const word = wordMsg.text;

        const formattedFileName = word.replace(/\s+(\w)(\w*)/g, function(_, first, rest) {
            return first.toUpperCase() + rest.toLowerCase();
        }) + ".json";

        fs.unlink('./assets/db/photos/' + formattedFileName, async (err) => {
            if (err) {
                console.error('Ошибка при удалении файла:', err);
                await bot.sendMessage(msg.message.chat.id, 'Ошибка при удалении файла');
                return;
            }
            console.log('Файл успешно удален:', formattedFileName);
            await bot.sendMessage(msg.message.chat.id, 'Файл успешно удален: ' + formattedFileName);
        });
    });
}


async function sendRandomPhotoFromJson(bot, msg) {
    console.log(msg.text)
    try {
        // Проверяем, является ли сообщение текстовым и не пустым
        if (msg.text && msg.text.trim() !== '') {
            console.log(msg.text)
            // Формируем путь к файлу JSON на основе текста сообщения
            const filePath = `./assets/db/photos/${msg.text.trim()}.json`;

            // Проверяем существование файла
            if (fs.existsSync(filePath)) {
                try {
                    // Читаем содержимое файла
                    const jsonData = require(filePath);

                    if (jsonData.photos && jsonData.photos.length > 0) {
                        // Выбираем случайную фотографию из массива фотографий
                        const randomPhoto = jsonData.photos[Math.floor(Math.random() * jsonData.photos.length)];
                        await bot.sendPhoto(msg.chat.id, randomPhoto.file_id);
                        console.log('Отправлено случайное фото из файла:', randomPhoto.file_id);
                    } else {
                        console.log('Фотографии не найдены в файле JSON.');
                    }
                } catch (error) {
                    console.error('Ошибка при чтении файла или парсинге JSON:', error);
                }
            } else {
                console.log(`Файл ${filePath} не найден.`);
            }
        }
    } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
    }
}

module.exports = {
    createFile: createFile,
    deleteFile: deleteFile,
    addPhotoToDatabase: addPhotoToDatabase,
    sendRandomPhotoFromJson: sendRandomPhotoFromJson
}