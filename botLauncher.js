const bot = require('./bot/index');

try {
    bot.launch();
} catch (error) {
    console.log(`Error occured while launching bot: ${error}`)
}