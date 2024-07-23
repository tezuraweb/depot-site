import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AuthReset = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError('Пароли не совпадают!');
            return;
        }

        try {
            const response = await axios.post('/api/reset-password', { password, confirmPassword, token }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.success) {
                setSuccess('Пароль успешно обновлен.\n\nПереходим на страницу входа...');
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 3000);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Ошибка обновления пароля.');
        }
    };

    return (
        <section className="section" id="auth-reset">
            <div className="container">
                <div className="page__login">
                    <h1 className="page__login--title">Задать пароль</h1>
                    <form className="form form--auth" onSubmit={handleSubmit}>
                        <div className="form__group">
                            <label className="form__label">Новый пароль</label>
                            <input 
                                type="password" 
                                name="password" 
                                className="form__input" 
                                placeholder="Введите новый пароль" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form__group">
                            <label className="form__label">Подтверждение пароля</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                className="form__input" 
                                placeholder="Повторите введенный пароль" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="form__button button button--large">Подтвердить</button>
                        {error && <div className="form__message form__message--red">{error}</div>}
                        {success && <div className="form__message form__message--green">{success}</div>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AuthReset;