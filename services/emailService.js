const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const mailConfig = require('../config/mailConfig');

const transporter = nodemailer.createTransport({
    auth: {
        user: mailConfig.address,
        pass: mailConfig.password,
    },
    host: mailConfig.host,
    port: 465,
    secure: true,
});

const sendVerificationEmail = async (email, token, isVerify = true) => {
    let text = '';
    if (isVerify) {
        text = `Добрый день!
        Для подтверждения данного почтового адреса и задания пароля перейдите по ссылке:
        http://localhost:3000/auth/verify/${token} 
        Спасибо!`
    } else {
        text = `Добрый день!
        Для обновления пароля перейдите по ссылке:
        http://localhost:3000/auth/reset/${token} 
        Спасибо!`;
    }
    const mailConfigurations = {
        from: mailConfig.address,
        to: email,
        subject: 'Задание или сброс пароля',
        text: text
    };

    try {
        const info = await transporter.sendMail(mailConfigurations);
        console.log('Email Sent Successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const generateToken = (data, isMail = false) => {
    return jwt.sign(data, isMail ? jwtConfig.emailToken : jwtConfig.token, { expiresIn: isMail ? '10m' : '12h' });
};

module.exports = {
    sendVerificationEmail,
    generateToken,
};
