import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import TicketModal from '../includes/TicketModal';

const RequestsList = () => {
    const [requests, setRequests] = useState({});
    const [telegramUsername, setTelegramUsername] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [hasTg, setHasTg] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);

    const statusNames = {
        closed: 'Закрыто',
        new: 'Ожидание',
        in_process: 'Активно'
    }

    useEffect(() => {
        axios.get('/api/requests')
            .then(response => {
                const groupedTickets = response.data.reduce((acc, ticket) => {
                    const ticketNumber = ticket.ticket_number;
                    if (!acc[ticketNumber]) {
                        acc[ticketNumber] = [];
                    }

                    acc[ticketNumber].push(ticket);
                    acc[ticketNumber].sort((a, b) => new Date(a.date) - new Date(b.date));
                    return acc;
                }, {});
                setRequests(groupedTickets);
            })
            .catch(error => {
                console.error('Error fetching requests:', error)
            });

            fetchTgData();
    }, []);

    const fetchTgData = () => {
        axios.get('/api/tenant/tg')
            .then(response => {
                setTelegramUsername(response.data.username);
                console.log(response.data.username, response.data.tg_id)
                if (response.data.username && response.data.tg_id !== 0) {
                    setHasTg(true);
                }
            })
            .catch(error => console.error('Error fetching telegram username:', error));
    }

    const handleTelegramSubmit = (e) => {
        e.preventDefault();

        let username = telegramUsername.trim();
        if (username.startsWith('@')) {
            username = username.slice(1);
        } else if (username.startsWith('t.me/')) {
            username = username.slice(5);
        }

        const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
        if (!username) {
            setError('Имя пользователя не может быть пустым.');
            setTimeout(() => {
                setError('');
            }, 5000);
            return;
        } else if (!usernameRegex.test(username)) {
            setError('Некорректное имя пользователя. Имя должно содержать от 5 до 32 символов и может содержать буквы, цифры и символы подчеркивания.');
            setTimeout(() => {
                setError('');
            }, 5000);
            return;
        }

        axios.post('/api/tenant/tg', { tg_user: username })
            .then(response => {
                setTelegramUsername(username);
                fetchTgData();
                setSuccess('Имя пользователя успешно обновлено!');
                setTimeout(() => {
                    setSuccess('');
                }, 5000);
            })
            .catch(error => {
                setError('Ошибка обновления.');
                setTimeout(() => {
                    setError('');
                }, 5000);
                console.error('Error updating telegram username:', error);
            });
    };

    const handleRequestClick = (ticketNumber) => {
        setSelectedRequest(requests[ticketNumber]);
    };

    return (
        <div className="requests">
            <h2 className="requests__title">Ваши обращения</h2>
            <div className="requests__summary">
                Создать обращение можно с помощью Telegram-бота, для этого задайте ваше имя пользователя Telegram и перейдите в бота. Для запуска бота введите команду /start.
            </div>

            <form className="form form--small" onSubmit={handleTelegramSubmit}>
                <input
                    type="text"
                    name="telegramUsername"
                    placeholder="Имя пользователя Telegram"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="form__input"
                />
                <button type="submit" className="form__button button">Сохранить</button>
                {error && <div className="form__message form__message--red">{error}</div>}
                {success && <div className="form__message form__message--green">{success}</div>}
            </form>

            {hasTg && (
                <div className="requests__form">
                    <button className="button animate--pulse" onClick={() => setShowTicketModal(true)}>Создать новое обращение</button>
                </div>
            )}

            <div className="requests__line">
                <div className="requests__title">История обращений</div>
                <div className="requests__title">Статус</div>
            </div>
            <div className="requests__list">
                {Object.keys(requests).map(ticketNumber => {
                    const request = requests[ticketNumber][0];
                    return (
                        <div className="requests__line" key={ticketNumber} onClick={() => handleRequestClick(ticketNumber)}>
                            <div className="requests__info">
                                Обращение от {format(new Date(request.date), 'd MMMM yyyy', { locale: ru })} года
                            </div>
                            <div className={`requests__status requests__status--${request.status}`}>{statusNames[request.status]}</div>
                        </div>
                    );
                })}
            </div>
            {selectedRequest && (
                <div className="requests__dialogue">
                    {selectedRequest.map((message, index) => (
                        <div key={index} className={`requests__message ${message.manager ? 'requests__message--manager' : ''}`}>
                            <div className="requests__meta">
                                <div className="requests__from">{message.manager ? 'Ответ менеджера:' : 'Вы:'}</div>
                                <div className="requests__time">{format(new Date(message.date), 'd MMMM yyyy, HH:mm', { locale: ru })}</div>
                            </div>
                            <div className="requests__text">{message.text}</div>
                        </div>
                    ))}
                </div>
            )}
            <div className="requests__desc requests__desc--new">Ваше обращение находится в очереди на рассмотрение</div>
            <div className="requests__desc requests__desc--in_process">По вашему обращению есть ответ от менеджера, пожалуйста, проверьте свой телеграм.</div>
            <div className="requests__desc requests__desc--closed">По вашему обращению было принято решение</div>
            {showTicketModal && <TicketModal onClose={() => setShowTicketModal(false)} />}
        </div>
    );
};

export default RequestsList;
