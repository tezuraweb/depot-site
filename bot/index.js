const { Scenes, Telegraf, session } = require('telegraf');
const config = require('../config/botConfig');
const createAuthScene = require('./scenes/authScene');
const createMainMenuScene = require('./scenes/mainMenuScene');
const createAdminMenuScene = require('./scenes/adminMenuScene');
const createTicketScene = require('./scenes/createTicketScene');
const createTicketHistoryScene = require('./scenes/ticketHistoryScene');
const createReportScene = require('./scenes/createReportScene');

class Bot {
    constructor(token) {
        this.token = token;
        this.bot = null;
        this.initializeBot();
    }

    initializeBot() {
        try {
            this.bot = new Telegraf(this.token);

            this.bot.use(session());

            const stage = new Scenes.Stage([
                createAuthScene(),
                createMainMenuScene(),
                createAdminMenuScene(),
                createTicketScene(),
                createTicketHistoryScene(),
                createReportScene(),
            ]);

            this.bot.use(stage.middleware());

            this.bot.command('start', (ctx) => {
                try {
                    ctx.scene.enter('AUTH_SCENE');
                } catch (error) {
                    this.handleError(ctx, error);
                }
            });

            this.bot.catch((err, ctx) => {
                this.handleError(ctx, err);
            });
        } catch (error) {
            console.error('Error initializing bot:', error);
        }
    }

    handleError(ctx, error) {
        console.log(`Encountered an error for ${ctx.updateType}`, error);
        ctx.reply("Произошла ошибка, пожалуйста, повторите попытку позже.");
    }

    launch() {
        if (this.bot) {
            try {
                this.bot.launch();
            } catch (error) {
                console.error('Error launching bot:', error);
            }
        } else {
            console.error('Bot instance is not initialized.');
        }
    }
}

const botInstance = new Bot(config.token);
module.exports = botInstance;