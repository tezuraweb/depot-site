const { Scenes, Markup } = require('telegraf');

const createAdminMenuScene = () => {
    const adminMenuScene = new Scenes.BaseScene('ADMIN_MENU_SCENE');

    adminMenuScene.enter((ctx) => {
        ctx.reply(
            "Выберите пункт меню:",
            Markup.keyboard(["Все обращения", "Создать отчет"]).oneTime().resize(),
        );
    });

    adminMenuScene.hears("Все обращения", (ctx) => {
        return ctx.scene.enter('TICKET_HISTORY_SCENE');
    });

    adminMenuScene.hears("Создать отчет", (ctx) => {
        return ctx.scene.enter('CREATE_REPORT_SCENE');
    });

    return adminMenuScene;
};

module.exports = createAdminMenuScene;
