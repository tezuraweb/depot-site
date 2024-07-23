const { Scenes } = require('telegraf');
const db = require('../../controllers/dbController');

const createAuthScene = () => {
    const authScene = new Scenes.BaseScene('AUTH_SCENE');

    authScene.enter(async (ctx) => {
        try {
            const user = await db.getTenantByParam({ 'tg_user': ctx.from.username });
            ctx.session.user = user;

            if (user) {
                if (user.status != 'admin' && user.status != 'tenant') {
                    ctx.reply("Вам отказано в доступе!");
                } else {
                    ctx.reply("Добро пожаловать, " + user.name + "!");

                    const userId = parseInt(user.tg_id);
                    if (isNaN(userId) || userId === 0) {
                        await db.setTenantTgId(user.id, ctx.from.id);
                    }

                    if (user.status == 'admin') {
                        return ctx.scene.enter('ADMIN_MENU_SCENE');
                    } else {
                        return ctx.scene.enter('MAIN_MENU_SCENE');
                    }
                }
            } else {
                ctx.reply("Неверный идентификатор пользователя!");
            }
        } catch (e) {
            ctx.reply("Ошибка!");
            console.log(e.message);
        }
    });

    authScene.command('start', (ctx) => {
        ctx.scene.reenter();
    });

    return authScene;
};

module.exports = createAuthScene;
