import React, { useState } from 'react';
import axios from 'axios';
import IconSprite from '../includes/IconSprite';
import { useViewportContext } from '../utils/ViewportContext';

const ContactForm = ({ modal = false, buttonView = '', modifier = '', url = null }) => {
    const deviceType = useViewportContext();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const popupClick = (e) => {
        if (e.target != e.currentTarget) return;

        setModalVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestData = formData;
            requestData.url = url ? url : window.location.href;
            const response = await axios.post('/api/contact', requestData);
            setFormData({ name: '', phone: '', email: '' });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 3000);
        }
    };

    const modifierClass = modifier === 'hero' ? 'hero__contactForm' : (modifier === 'share' ? 'share__contactForm' : '');
    const buttonModifier = modifier === 'share' ? (buttonView === 'icon' ? 'button--icon button--iconBlack' : 'button--black') : (buttonView === 'icon' ? 'button--icon' : 'button--large');

    return (
        <div className={`contact-form ${modifierClass}`}>
            {modal && (
                <button className={`form__open button ${buttonModifier} animate--pulse`} onClick={() => setModalVisible(true)}>{
                    buttonView == 'icon' ?
                        <IconSprite
                            selector="PhoneSimple"
                            width="26"
                            height="26"
                            fill="#000"
                        /> : (
                            <>
                                <span>Закажите звонок</span>
                                {(deviceType === 'mobile' && modifier == 'hero') && (
                                    <IconSprite
                                        selector="PhoneSimple"
                                        width="20"
                                        height="20"
                                        fill="#fff"
                                    />
                                )}
                            </>
                        )
                }</button>
            )}

            {(!modal || modalVisible) && (
                <div className={modal ? 'modal' : ''} onClick={modal ? (e) => popupClick(e) : null}>
                    <form onSubmit={handleSubmit} className={`form ${modal ? 'modal__content form--modal' : 'form--inline'}`}>
                        {modal && <button className="form__close button button--close" type="button" onClick={() => setModalVisible(false)}></button>}

                        <div className="form__group">
                            <label className="form__label" htmlFor="name">Как к вам обращаться?</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form__input"
                                required
                            />
                        </div>
                        <div className="form__group">
                            <label className="form__label" htmlFor="phone">Ваш номер телефона</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form__input"
                                required
                            />
                        </div>
                        <div className="form__group">
                            <label className="form__label" htmlFor="email">Ваш email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form__input"
                                required
                            />
                        </div>
                        <button type="submit" className="form__button button animate--pulse">Отправить</button>
                        {error && (
                            <div className="form__message form__message--icon">
                                <div className="form__message--fail"></div>
                            </div>
                        )}
                        {success && (
                            <div className="form__message form__message--icon">
                                <div className="form__message--success"></div>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
};

export default ContactForm;