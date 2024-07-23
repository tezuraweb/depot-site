import React, { useState } from 'react';
import axios from 'axios';
import IconSprite from './IconSprite';

const SignModal = ({ doc, onClose }) => {
    const [signED, setSignED] = useState(false);
    const [operator, setOperator] = useState('');
    const [customOperator, setCustomOperator] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);

    const handlePersonalClick = () => {
        setSignED(false);
        handleSignSubmit();
    };

    const handleSignSubmit = () => {
        const operatorToSend = operator === 'Other' && customOperator ? customOperator : operator;
        const data = {
            docId: doc.id,
            docName: doc.docname,
            signType: signED ? 'Через ЭДО' : 'Лично',
            operator: signED ? operatorToSend : null
        };
        axios.post('/api/docs/sign', data)
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
                    <h2 className="editor__title">Выбрать способ подписания</h2>
                    <button className="editor__close" onClick={onClose} aria-label="Закрыть">
                        <IconSprite
                            selector="CloseIcon"
                            width="30"
                            height="30"
                        />
                    </button>
                </div>

                <div className="editor__popup--buttons">
                    <button className="button animate--pulse" onClick={handlePersonalClick}>Лично</button>
                    <button className="button animate--pulse" onClick={() => setSignED(true)}>Через ЭДО</button>
                </div>

                {signED && (
                    <div className="form form--admin">
                        <div className="form__group">
                            <select className="form__input" onChange={(e) => setOperator(e.target.value)}>
                                <option value="">Укажите оператора</option>
                                <option value="АЙТИКОМ (ITCOM)">АЙТИКОМ (ITCOM)</option>
                                <option value="Банк Точка (Точка: Документооборот)">Банк Точка (Точка: Документооборот)</option>
                                <option value="Бифит (БИФИТ ЭДО)">Бифит (БИФИТ ЭДО)</option>
                                <option value="ЕЭТП (Росэлторг) (Росинвойс)">ЕЭТП (Росэлторг) (Росинвойс)</option>
                                <option value="Инфотекс ИТ (ViPNet)">Инфотекс ИТ (ViPNet)</option>
                                <option value="КрасКрипт (СТЭК-Траст)">КрасКрипт (СТЭК-Траст)</option>
                                <option value="Криптэкс (Signatura)">Криптэкс (Signatura)</option>
                                <option value="НИИАС (НИИАС)">НИИАС (НИИАС)</option>
                                <option value="НТСофт (Сервис ЭДО.МИГ24)">НТСофт (Сервис ЭДО.МИГ24)</option>
                                <option value="НТЦ СТЭК (СТЭК)">НТЦ СТЭК (СТЭК)</option>
                                <option value="Петер-Сервис Спецтехнологии (ЭДО.Поток)">Петер-Сервис Спецтехнологии (ЭДО.Поток)</option>
                                <option value="Русь-Телеком (Фельдъегерь: ЭДО)">Русь-Телеком (Фельдъегерь: ЭДО)</option>
                                <option value="Сберключ (Сбербанк-АСТ)">Сберключ (Сбербанк-АСТ)</option>
                                <option value="ТаксНет (Транскрипт)">ТаксНет (Транскрипт)</option>
                                <option value="ТЭК-Торг (ЭДО ТЭК-Торг)">ТЭК-Торг (ЭДО ТЭК-Торг)</option>
                                <option value="УЦ АСКОМ (АСКОМ.NET)">УЦ АСКОМ (АСКОМ.NET)</option>
                                <option value="УЦ СОЮЗ (ЭДО Командор)">УЦ СОЮЗ (ЭДО Командор)</option>
                                <option value="Финтендер-Крипто (Fintender-EDS)">Финтендер-Крипто (Fintender-EDS)</option>
                                <option value="ФораПром (LeraData)">ФораПром (LeraData)</option>
                                <option value="Э-Ком (Docrobot)">Э-Ком (Docrobot)</option>
                                <option value="Эвотор ОФД (Платформа.ЭДО)">Эвотор ОФД (Платформа.ЭДО)</option>
                                <option value="Электронный экспресс (Гарант ДокМэйл (ЭДО ЭП))">Электронный экспресс (Гарант ДокМэйл (ЭДО ЭП))</option>
                                <option value="Электронный экспресс (Экспресс Документ)">Электронный экспресс (Экспресс Документ)</option>
                                <option value="ЭТП ГПБ (Система ЭДО ЭТП ГПБ)">ЭТП ГПБ (Система ЭДО ЭТП ГПБ)</option>
                                <option value="CISLink (DOCLINK)">CISLink (DOCLINK)</option>
                                <option value="Other">Другое</option>
                            </select>
                        </div>
                        {operator === 'Other' && (
                            <div className="form__group">
                                <input
                                    type="text"
                                    className="form__input"
                                    placeholder="Введите название оператора"
                                    onChange={(e) => setCustomOperator(e.target.value)}
                                />
                            </div>
                        )}
                        <button className="button animate--pulse" onClick={handleSignSubmit}>Отправить</button>
                    </div>
                )}
                {successMessage && <div className="editor__message editor__message--green">Запрос на подписание отправлен</div>}
                {failMessage && <div className="editor__message editor__message--red">Ошибка отправки запроса</div>}
            </div>
        </div>
    );
};

export default SignModal;
