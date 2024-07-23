const { Scenes, Markup } = require('telegraf');
const wkhtmltopdf = require('wkhtmltopdf');
const path = require('path');
const fs = require('fs');
// const htmlPdfNode = require('html-pdf-node');
const nunjucks = require('nunjucks');

const createReportScene = () => {
    const createReportScene = new Scenes.BaseScene('CREATE_REPORT_SCENE');

    createReportScene.enter((ctx) => {
        ctx.reply(
            "Выберите базу для формирования отчета:",
            Markup.inlineKeyboard([
                [Markup.button.callback('Депо', 'base1')],
                [Markup.button.callback('Гагаринский', 'base2')],
                [Markup.button.callback('Южная', 'base3')],
            ]).oneTime().resize(),
        );
    });

    createReportScene.action('base1', async (ctx) => {
        ctx.reply("Создание отчета, подождите...");
        generateAndSendReport(ctx, 'depot');
    });

    createReportScene.action('base2', async (ctx) => {
        ctx.reply("Создание отчета, подождите...");
        generateAndSendReport(ctx, 'gagarinsky');
    });

    createReportScene.action('base3', async (ctx) => {
        ctx.reply("Создание отчета, подождите...");
        generateAndSendReport(ctx, 'yujnaya');
    });

    const generateAndSendReport = async (ctx, base) => {
        try {
            const reportsDir = path.join(__dirname, '..', 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir);
            }

            let baseName = '';
            if (base == 'depot') {
                baseName = 'АО ДЕПО';
            } else if (base == 'gagarinsky') {
                baseName = 'ПКЦ ООО ГАГАРИНСКИЙ';
            } else if (base == 'yujnaya') {
                baseName = 'ООО База Южная и ООО Строительная База Южная';
            }

            const dateLine = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    
            const pdfPath = path.join(reportsDir, `Отчет ${baseName} на ${dateLine}.pdf`);
    
            const options = {
                noOutline: true,
                marginTop: 0,
                headerCenter: 'My Report'
            };
    
            wkhtmltopdf(`http://localhost:3000/api/report/print/${base}`, options)
                .pipe(fs.createWriteStream(pdfPath))
                .on('finish', async () => {
                    try {
                        await ctx.replyWithDocument({ source: pdfPath });
                        fs.unlinkSync(pdfPath);
                    } catch (err) {
                        console.error(`Failed to send PDF: ${err}`);
                    }
                    return ctx.scene.enter('ADMIN_MENU_SCENE');
                })
                .on('error', (err) => {
                    console.error(`Error generating PDF: ${err}`);
                    ctx.reply("Произошла ошибка генерации отчета, попробуйте позже.");
                    return ctx.scene.enter('ADMIN_MENU_SCENE');
                });
        } catch (error) {
            console.error(`Error in generateAndSendReport: ${error}`);
            ctx.reply("Произошла ошибка генерации отчета, попробуйте позже.");
            return ctx.scene.enter('ADMIN_MENU_SCENE');
        }
    };

    return createReportScene;
};

module.exports = createReportScene;