const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const createTicketScene = () => {
    const createTicketScene = new Scenes.BaseScene('CREATE_TICKET_SCENE');

    createTicketScene.enter((ctx) => {
        ctx.session.ticket = {
            text: '',
            files: [],
            photos: [],
            messages: [],
        };
        ctx.reply("Введите сообщение. Вы также можете прикрепить файлы. Когда закончите, нажмите 'Подтвердить'.",
            Markup.keyboard(['Назад']).oneTime().resize());
    });

    createTicketScene.hears("Назад", (ctx) => {
        if (ctx.session.user.status == 'admin') {
            return ctx.scene.enter('ADMIN_MENU_SCENE');
        } else {
            return ctx.scene.enter('MAIN_MENU_SCENE');
        }
    });

    createTicketScene.hears("Подтвердить", async (ctx) => {
        try {
            const ticketData = ctx.session.ticket;
            if (ctx.session.newTicketInquirer) {
                ticketData.inquirer = ctx.session.newTicketInquirer;
                ticketData.manager = ctx.from.id;
            } else {
                ticketData.inquirer = ctx.from.id;
            }
            if (ctx.session.newTicketNumber) {
                ticketData.ticket_number = ctx.session.newTicketNumber;
                ticketData.isNew = false;
            } else {
                ticketData.isNew = true;
            }
            if (ctx.session.newTicketInquirerUsername) {
                ticketData.inquirer_username = ctx.session.newTicketInquirerUsername;
            } else {
                ticketData.inquirer_username = ctx.from.username;
            }

            const ticket = await db.insertTicketBot(ticketData);

            if (ctx.session.updateTicketStatus && ctx.session.newTicketNumber) {
                await db.updateTicketStatusBot({ticket_number : ctx.session.newTicketNumber, status: 'in_process'});
            }

            if (ctx.session.newTicketNumber && ctx.session.newTicketInquirer) {
                console.log(ctx.session.newTicketInquirer)
                await ctx.telegram.sendMessage(ctx.session.newTicketInquirer, `Ответ на ваше обращение:\n\n${ctx.session.ticket.text}`);

                for (const photoUrl of ctx.session.ticket.photos) {
                    await ctx.telegram.sendPhoto(ctx.session.newTicketInquirer, photoUrl);
                }
    
                for (const fileId of ctx.session.ticket.files) {
                    await ctx.telegram.sendDocument(ctx.session.newTicketInquirer, fileId);
                }
            }

            ctx.session.newTicketNumber = null;
            ctx.session.newTicketInquirer = null;
            ctx.session.updateTicketStatus = null;

            if (ctx.session.user.status == 'admin') {
                ctx.reply("Ваш ответ записан!");
                return ctx.scene.enter('ADMIN_MENU_SCENE');
            } else {
                ctx.reply("Ваше обращение зарегистрировано!");
                return ctx.scene.enter('MAIN_MENU_SCENE');
            }
        } catch (e) {
            ctx.reply("Ошибка!");
            console.log(e.message);
            return ctx.scene.reenter();
        }
    });

    createTicketScene.on("message", async (ctx) => {
        try {
            if (ctx.message.text) {
                ctx.session.ticket.text += ctx.message.text + '\n';
            }

            if (ctx.message.caption) {
                ctx.session.ticket.text += ctx.message.caption + '\n';
            }

            if (ctx.message.photo) {
                const photo = ctx.message.photo[0];
                ctx.session.ticket.photos.push(photo.file_id);
            }

            if (ctx.message.document) {
                ctx.session.ticket.files.push(ctx.message.document.file_id);
            }

            ctx.session.ticket.messages.push(ctx.message.message_id);

            ctx.reply("Часть обращения сохранена. Вы можете продолжать добавлять информацию или нажать 'Подтвердить'.", Markup.keyboard(['Подтвердить', 'Назад']).oneTime().resize());
        } catch (e) {
            ctx.reply("Ошибка!");
            console.log(e.message);
            return ctx.scene.reenter();
        }
    });

    createTicketScene.leave(async (ctx) => {
        ctx.session.ticket = null;
    });

    return createTicketScene;
};

module.exports = createTicketScene;
