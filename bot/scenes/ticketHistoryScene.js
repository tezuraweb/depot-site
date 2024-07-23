const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const createTicketHistoryScene = () => {
    const statusValues = {
        new: 'новое',
        in_process: 'в процессе',
        closed: 'закрыто',
    }

    const ticketHistoryScene = new Scenes.BaseScene('TICKET_HISTORY_SCENE');

    ticketHistoryScene.enter(async (ctx) => {
        ctx.session.ticketList = [];
        ctx.session.ticketOffset = 0;
        ctx.session.ticketLimit = 9;
        if (ctx.session.user.status == 'admin') {
            ctx.reply("Выберите категорию обращений:",
                Markup.keyboard(['Новые обращения', 'В процессе', 'Выйти']).oneTime().resize());
        } else {
            await sendTicketList(ctx, 0);
        }
    });

    ticketHistoryScene.hears("Выйти", (ctx) => {
        if (ctx.session.user.status == 'admin') {
            return ctx.scene.enter('ADMIN_MENU_SCENE');
        } else {
            return ctx.scene.enter('MAIN_MENU_SCENE');
        }
    });

    ticketHistoryScene.action('get_chain', async (ctx) => {
        ctx.session.msgIndex = 0;
        showMessage(ctx);
    });

    ticketHistoryScene.action('next_msg', async (ctx) => {
        ctx.session.msgIndex = ctx.session.msgIndex + 1;
        showMessage(ctx);
    });

    ticketHistoryScene.action('get_last', (ctx) => {
        ctx.session.msgIndex = ctx.session.ticketData.length - 1;
        showMessage(ctx);
    });

    ticketHistoryScene.action('next_page', async (ctx) => {
        ctx.session.ticketOffset = ctx.session.ticketOffset + ctx.session.ticketLimit;
        await sendTicketList(ctx);
    });

    ticketHistoryScene.action('reply', (ctx) => {
        const ticket = ctx.session.ticketList[ctx.session.currentTicketIndex];
        ctx.session.newTicketNumber = ticket.ticket_number;
        if (ctx.session.user.status == 'admin') {
            ctx.session.newTicketInquirer = ticket.inquirer;
            ctx.session.newTicketInquirerUsername = ticket.inquirer_username;
            if (ticket.status === 'new') {
                ctx.session.updateTicketStatus = true;
            }
        }

        return ctx.scene.enter('CREATE_TICKET_SCENE');
    });

    ticketHistoryScene.action('close', async (ctx) => {
        const ticket = ctx.session.ticketList[ctx.session.currentTicketIndex];

        await db.updateTicketStatusBot({ ticket_number: ticket.ticket_number, status: 'closed' });
        ctx.reply("Обращение закрыто!",
            Markup.keyboard(['Назад']).oneTime().resize());

        return ctx.scene.reenter();
    });

    ticketHistoryScene.action('back', async (ctx) => {
        if (ctx.session.user.status == 'admin') {
            return ctx.scene.enter('ADMIN_MENU_SCENE');
        } else {
            return ctx.scene.enter('MAIN_MENU_SCENE');
        }
    });

    ticketHistoryScene.hears('Новые обращения', async (ctx) => {
        if (ctx.session.user.status !== 'admin') {
            return;
        }
        ctx.session.ticketStatus = 'new';
        await sendTicketList(ctx);
    });

    ticketHistoryScene.hears('В процессе', async (ctx) => {
        if (ctx.session.user.status !== 'admin') {
            return;
        }
        ctx.session.ticketStatus = 'in_process';
        await sendTicketList(ctx);
    });

    ticketHistoryScene.action(/ticket_\d+/, async (ctx) => {
        const ticketIndex = parseInt(ctx.match[0].split('_')[1]) - 1;
        const ticket = ctx.session.ticketList[ticketIndex];

        if (ticket) {
            ctx.session.currentTicketIndex = ticketIndex;

            ctx.session.ticketData = await db.getTicketByNumberBot(ticket.ticket_number);
            let text = `Статус: ${statusValues[ticket.status]}\n\n`;

            for (const msg of ctx.session.ticketData) {
                text += `Дата обновления: ${msg.date}\n${msg.manager ? 'Ответ менеджера' : 'Вопрос пользователя'}:\n\n${msg.text}\n`
            }
            ctx.reply(text,
                Markup.inlineKeyboard([
                    [Markup.button.callback('Просмотр сообщений', 'get_chain')],
                    [Markup.button.callback('Последнее', 'get_last'), Markup.button.callback('Ответить', 'reply')],
                    [Markup.button.callback('Закрыть', 'close'), Markup.button.callback('Назад', 'back')]
                ]));
        } else {
            ctx.reply("Неверный индекс!",
                Markup.keyboard(['Выйти']).oneTime().resize());
        }
    });

    const showMessage = async (ctx) => {
        try {
            const { text, files, photos, date } = ctx.session.ticketData[ctx.session.msgIndex];
            let keyboard = ctx.session.msgIndex == ctx.session.ticketData.length - 1 ?
                Markup.inlineKeyboard([
                    [Markup.button.callback('Написать ответ', 'reply')],
                    [Markup.button.callback('Назад', 'back')]
                ]) : Markup.inlineKeyboard([
                    [Markup.button.callback('Написать ответ', 'reply')],
                    [Markup.button.callback('Назад', 'back'), Markup.button.callback('Дальше', 'next_msg')]
                ]);

            await ctx.reply(`Дата обновления: ${date}\n\n${text}`,
                keyboard);

            for (const photoUrl of photos) {
                await ctx.telegram.sendPhoto(ctx.chat.id, photoUrl);
            }

            for (const fileId of files) {
                await ctx.telegram.sendDocument(ctx.chat.id, fileId);
            }
        } catch (e) {
            ctx.reply("Ошибка!",
                Markup.keyboard(['Назад']).oneTime().resize());
            console.log(e.message);
        }
    }

    const sendTicketList = async (ctx) => {
        try {
            let tickets = [];
            if (ctx.session.user.status == 'admin' && ctx.session.ticketStatus) {
                tickets = await db.getTicketsByStatusBot(ctx.session.ticketStatus, ctx.session.ticketOffset, ctx.session.ticketLimit);
            } else {
                tickets = await db.getTicketsByUserBot(ctx.from.id, ctx.session.ticketOffset, ctx.session.ticketLimit);
            }

            if (tickets?.length > 0) {
                const offset = ctx.session.ticketOffset;
                ctx.session.ticketList = ctx.session.ticketList.concat(tickets);

                const ticketList = tickets.map((ticket, index) => `${index + 1 + offset}. ${ticket.date}\n${ticket.text.slice(0, 30)}...`).join('\n\n');

                const keyboardButtons = tickets.map((ticket, index) =>
                    Markup.button.callback(`${index + 1 + offset}`, `ticket_${index + 1 + offset}`)
                );

                const keyboard = [keyboardButtons.slice(0, 3)];
                if (keyboardButtons.length >= 3) {
                    keyboard.push(keyboardButtons.slice(3, 6));
                }
                if (keyboardButtons.length >= 6) {
                    keyboard.push(keyboardButtons.slice(6));
                }

                if (tickets.length === ctx.session.ticketLimit) {
                    keyboard.push([Markup.button.callback('Дальше', 'next_page')]);
                }
                keyboard.push([Markup.button.callback('Выйти', 'back')]);

                ctx.reply(
                    `Ваши обращения:\n\n${ticketList}`,
                    Markup.inlineKeyboard(keyboard));
            } else {
                if (ctx.session.user.status == 'admin' && ctx.session.ticketStatus) {
                    ctx.reply("Нет обращений в этой категории.");
                    return ctx.scene.reenter();
                } else {
                    ctx.reply("У вас нет обращений.");
                    return ctx.scene.enter('MAIN_MENU_SCENE');
                }
            }
        } catch (e) {
            ctx.reply("Ошибка!",
                Markup.keyboard(['Выйти']).oneTime().resize());
            console.log(e.message);
        }
    };

    ticketHistoryScene.leave(async (ctx) => {
        ctx.session.ticketOffset = null;
        ctx.session.ticketLimit = null;
        ctx.session.ticketList = null;
        ctx.session.ticketStatus = null;
        ctx.session.currentTicketIndex = null;
        ctx.session.ticketData = null;
    });

    return ticketHistoryScene;
};

module.exports = createTicketHistoryScene;
