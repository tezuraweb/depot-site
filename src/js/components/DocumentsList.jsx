import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SignModal from '../includes/SignModal';
import IconSprite from '../includes/IconSprite';

const DocumentsList = () => {
    const [documents, setDocuments] = useState([]);
    const [showSignModal, setShowSignModal] = useState(false);
    const [signingDoc, setSigningDoc] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);
    const [docType, setDocType] = useState('');
    const [customRequest, setCustomRequest] = useState('');

    const docTypes = ['Акт', 'Справка'];

    useEffect(() => {
        axios.get('/api/docs')
            .then(response => setDocuments(response.data))
            .catch(error => console.error('Error fetching documents:', error));
    }, []);

    const handlePrint = (url) => {
        const printWindow = window.open(url, '_blank');
        printWindow.addEventListener('load', () => {
            printWindow.print();
        });
    };

    const handleSign = (doc) => {
        setSigningDoc(doc);
        setShowSignModal(true);
    };

    const handleRequestSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/docs/request', { docType, customRequest })
            .then(response => setSuccessMessage(true))
            .catch(error => setFailMessage(true));

        setTimeout(() => {
            setSuccessMessage(false);
            setFailMessage(false);
        }, 5000);
    };

    return (
        <div className="editor">
            <h2 className="editor__title">Договоры</h2>
            <div className="editor__list">
                {documents.filter(doc => doc.doctype === 'Договор аренды').map(doc => (
                    <div className="editor__item" key={doc.id}>
                        <div className="editor__line">
                            <div className="editor__name">{doc.docname}</div>
                            <div className="editor__buttons">
                                <button className="editor__button button button--icon button--smallIcon" onClick={() => handlePrint(doc.link)}>
                                    <IconSprite
                                        selector="PrinterIcon"
                                        width="18"
                                        height="18"
                                    />
                                </button>
                                <a className="editor__button button button--icon button--smallIcon" href={doc.link} download>
                                    <IconSprite
                                        selector="DownloadIcon"
                                        width="18"
                                        height="18"
                                    />
                                </a>
                                <a className="editor__button button button--icon button--smallIcon" href={doc.link} target='_blank'>
                                    <IconSprite
                                        selector="MagnifierIcon"
                                        width="16"
                                        height="16"
                                    />
                                </a>
                            </div>
                        </div>

                        {doc.status === 'Не действующий' && (
                            <div className="editor__line">
                                <button className="button animate--pulse" onClick={() => handleSign(doc)}>Подписать</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <h2 className="editor__title">Документы</h2>
            <div className="editor__list">
                {documents.filter(doc => doc.doctype !== 'Договор аренды').map(doc => (
                    <div className="editor__item" key={doc.id}>
                        <div className="editor__line">
                            <div className="editor__name">{doc.docname}</div>
                            <div className="editor__buttons">
                                <button className="editor__button button button--icon button--smallIcon" onClick={() => handlePrint(doc.link)}>
                                    <IconSprite
                                        selector="PrinterIcon"
                                        width="18"
                                        height="18"
                                    />
                                </button>
                                <a className="editor__button button button--icon button--smallIcon" href={doc.link} download>
                                    <IconSprite
                                        selector="DownloadIcon"
                                        width="18"
                                        height="18"
                                    />
                                </a>
                                <a className="editor__button button button--icon button--smallIcon" href={doc.link} target='_blank'>
                                    <IconSprite
                                        selector="MagnifierIcon"
                                        width="16"
                                        height="16"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="editor__title">Запросить документы</h2>
            <form className="form form--admin" onSubmit={handleRequestSubmit}>
                <div className="form__group">
                    <select className="form__input form__input--black" name="documentType" onChange={(e) => setDocType(e.target.value)}>
                        <option value="" disabled>Выберите документ</option>
                        {docTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="form__group">
                    <div className="form__label">Другой запрос</div>
                    <input
                        className="form__input form__input--black"
                        type="text"
                        name="otherRequest"
                        placeholder="Введите название необходимого документа"
                        onChange={(e) => setCustomRequest(e.target.value)}
                    />
                </div>
                <button className="button animate--pulse" type="submit">Запросить</button>
            </form>
            {successMessage && <div className="editor__message editor__message--green">Запрос успешно отправлен</div>}
            {failMessage && <div className="editor__message editor__message--red">Ошибка отправки запроса</div>}
            {showSignModal && <SignModal doc={signingDoc} onClose={() => setShowSignModal(false)} />}
        </div>
    );
};

export default DocumentsList;
