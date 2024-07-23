import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState({
        new: true,
        inProgress: true,
        completed: true
    });

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('/api/tickets');
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, []);

    const handleFilterChange = (type) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            [type]: !prevFilter[type]
        }));
    };

    const filteredTickets = tickets.filter(ticket => {
        if (ticket.status === 'Новое' && filter.new) return true;
        if (ticket.status === 'В работе' && filter.inProgress) return true;
        if (ticket.status === 'Завершено' && filter.completed) return true;
        return false;
    });

    return (
        <div className="tickets">
            <div className="tickets__header">
                <h2>Ваши обращения</h2>
                <div className="tickets__filters">
                    <label>
                        <input type="checkbox" checked={filter.new} onChange={() => handleFilterChange('new')} />
                        Новые
                    </label>
                    <label>
                        <input type="checkbox" checked={filter.inProgress} onChange={() => handleFilterChange('inProgress')} />
                        В работе
                    </label>
                    <label>
                        <input type="checkbox" checked={filter.completed} onChange={() => handleFilterChange('completed')} />
                        Завершенные
                    </label>
                </div>
                <div className="tickets__summary">
                    <div>Новых <span>{tickets.filter(t => t.status === 'Новое').length}</span></div>
                    <div>В работе <span>{tickets.filter(t => t.status === 'В работе').length}</span></div>
                    <div>Завершено <span>{tickets.filter(t => t.status === 'Завершено').length}</span></div>
                    <div>Всего <span>{tickets.length}</span></div>
                </div>
            </div>

            <div className="tickets__list">
                {filteredTickets.map((ticket, index) => (
                    <div key={index} className={`ticket-card ${ticket.status}`}>
                        <div className="ticket-status">{ticket.status}</div>
                        <div className="ticket-info">
                            <p>TG Id: {ticket.tgId}</p>
                            <p>ИНН: {ticket.inn}</p>
                            <p>Литер: {ticket.liter}</p>
                            <p>Место: {ticket.place}</p>
                            <p>Дата: {ticket.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tickets;
