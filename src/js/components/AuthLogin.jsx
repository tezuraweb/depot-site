import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const isEmail = (login) => /\S+@\S+\.\S+/.test(login);
    const isTin = (login) => /^\d+$/.test(login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!isEmail(login) && !isTin(login)) {
            setError('Введите корректный Email или ИНН.');
            return;
        }

        try {
            const response = await axios.post('/api/login', { login: login.trim(), password }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.success) {
                window.location.href = '/backoffice/profile';
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Ошибка входа. Проверьте ваши данные.');
        }
    };

    return (
        <div className="page__login">
            <h1 className="page__login--title">Авторизация</h1>
            <form className="form form--auth" onSubmit={handleSubmit}>
                <div className="form__group">
                    <label className="form__label">Email или ИНН</label>
                    <input
                        type="text"
                        name="login"
                        className="form__input"
                        placeholder="Email или ИНН"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div className="form__group">
                    <label className="form__label">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        className="form__input"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="form__button button button--large">Войти</button>
                <div className="form__group form__group--inline">
                    <a href="/auth/signup" className="form__link button">Регистрация</a>
                    <a href="/auth/password-reset" className="form__link button">Сброс пароля</a>
                </div>
                {error && <div className="form__message form__message--red">{error}</div>}
            </form>
        </div>
    );
};

export default Login;
