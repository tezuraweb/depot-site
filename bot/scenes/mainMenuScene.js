const { Scenes, Markup } = require('telegraf');

const createMainMenuScene = () => {
    const menuScene = new Scenes.BaseScene('MAIN_MENU_SCENE');

    menuScene.enter((ctx) => {
        ctx.reply(
            "Выберите пункт меню:",
            Markup.keyboard(["Написать обращение", "Мои обращения"]).oneTime().resize(),
        );
    });

    menuScene.hears("Написать обращение", (ctx) => {
        return ctx.scene.enter('CREATE_TICKET_SCENE');
    });

    menuScene.hears("Мои обращения", (ctx) => {
        return ctx.scene.enter('TICKET_HISTORY_SCENE');
    });

    return menuScene;
};

module.exports = createMainMenuScene;
