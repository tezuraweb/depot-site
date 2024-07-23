import React, { useState } from 'react';
import axios from 'axios';

const AuthRegister = ({ mode = "signup" }) => {
    const [step, setStep] = useState(1);
    const [tin, setTin] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleTinCheck = async () => {
        try {
            const response = await axios.post('/api/signup/check', { tin });
            if (response.data.exists) {
                if (response.data.signedUp) {
                    setError('Пользователь уже зарегистрирован!');
                } else {
                    setStep(2);
                }
            } else {
                setError('tin_error');
            }
        } catch (err) {
            setError('tin_error');
        }
    };

    const handleEmailVerification = async () => {
        try {
            if (mode === 'signup') {
                await axios.post('/api/signup/verify-email', { tin: tin.trim(), email: email.trim() });
            } else {
                await axios.post('/api/password-reset/initiate', { tin: tin.trim(), email: email.trim() });
            }
            setStep(3);
            setMessage('На указанный адрес отправлено письмо с проверочной ссылкой.')
        } catch (err) {
            setError('Ошибка при отправке проверочного письма.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (mode === 'signup') {
            if (step === 1) {
                handleTinCheck();
            } else if (step === 2) {
                handleEmailVerification();
            }
        } else {
            handleEmailVerification();
        }
    };

    return (
        <div className="page__login">
            <h1 className="page__login--title">{mode === 'signup' ? 'Регистрация' : 'Сброс пароля'}</h1>
            <form className="form form--auth" onSubmit={handleSubmit}>
                {mode === 'signup' && step === 1 && (
                    <div className="form__group">
                        <label className="form__label">ИНН</label>
                        <input
                            type="text"
                            name="tin"
                            className="form__input"
                            placeholder="ИНН"
                            value={tin}
                            onChange={(e) => setTin(e.target.value)}
                            required
                        />
                    </div>
                )}
                {(step === 2 || mode === 'password-reset') && (
                    <>
                        {mode === 'password-reset' && (
                            <div className="form__group">
                                <label className="form__label">ИНН</label>
                                <input
                                    type="text"
                                    name="tin"
                                    className="form__input"
                                    placeholder="ИНН"
                                    value={tin}
                                    onChange={(e) => setTin(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="form__group">
                            <label className="form__label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form__input"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                {step !== 3 && (
                    <button type="submit" className="form__button button button--large">
                        {step === 1 ? 'Дальше' : 'Подтвердить'}
                    </button>
                )}
                {error && (
                    error === 'tin_error' ? (
                        <div className="form__message form__message--red">
                            Ваш ИНН не зарегистрирован в нашей базе данных.<br /><br />
                            Пожалуйста, свяжитесь со своим менеджером или позвоните на горячую линию по телефону.<br /><br />
                            <a href="tel:+79120557755" className="form__message--large">+7 (912) 055-77-55</a>
                        </div>
                    ) : (
                        <div className="form__message form__message--red">{error}</div>
                    )
                )}
                {message && <div className="form__message form__message--green">{message}</div>}
            </form>
        </div>
    );
};

export default AuthRegister;
