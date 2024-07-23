import React, { useState } from 'react';
import axios from 'axios';
import IconSprite from './IconSprite';

const SignModal = ({ onClose }) => {
    const [text, setText] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('/api/request/create', { text })
            .then(response => setSuccessMessage(true))
            .catch(error => setFailMessage(true));

        setTimeout(() => {
            setSuccessMessage(false);
            setFailMessage(false);
        }, 5000);
    };

    return (
        <div className="editor__popup">
            <div className="editor__popup--content">
                <div className="editor__popup--header flex flex--sb flex--center">
                    <h2 className="editor__title">Создать новое обращение</h2>
                    <button className="editor__close" onClick={onClose} aria-label="Закрыть">
                        <IconSprite
                            selector="CloseIcon"
                            width="30"
                            height="30"
                        />
                    </button>
                </div>

                <form className="form form--admin" onSubmit={handleSubmit}>
                    <div className="form__group">
                        <textarea
                            className="form__input form__input--black"
                            name="text"
                            id="ticketText"
                            rows="5"
                            placeholder="Введите текст обращения"
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>

                    <button className="button animate--pulse" onClick={handleSubmit}>Отправить</button>
                    {successMessage && <div className="editor__message editor__message--green">Запрос отправлен</div>}
                    {failMessage && <div className="editor__message editor__message--red">Ошибка отправки запроса</div>}
                </form>

            </div>
        </div>
    );
};

export default SignModal;
