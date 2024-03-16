module.exports = {
    adminKeyboard: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Создать триггер слово", callback_data: "createTrigger"}],
                [{text: "Удалить триггер слово", callback_data: "deleteTrigger"}],
                [{text: "Добавить картинку к триггер слову", callback_data: "addImageToTrigger"}]
            ]

        })
    }
}