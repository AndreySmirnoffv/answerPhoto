module.exports = {
    adminKeyboard: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Создать триггер слово", callback_data: "createTrigger"}],
                [{text: "Удалить триггер слово", callback_data: "deleteTrigger"}]
            ]

        })
    }
}