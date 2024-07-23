import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Manager = () => {
    const [data, setData] = useState({
        id: '',
        name: '',
        text: '',
        photo: ''
    });

    useEffect(() => {
        const fetchManager = async () => {
            try {
                const response = await axios.get('/api/manager');
                setData(response.data);
            } catch (error) {
                setData({
                    id: '',
                    name: '',
                    text: '',
                    photo: ''
                });
                console.error('Error fetching manager', error);
            }
        };

        fetchManager();
    }, []);

    return (
        <div className="manager__content flex">
            <img src={data.photo} alt={data.name} className="manager__photo" />
            <div className="flex flex--col">
                <p className="manager manager__name">{data.name}</p>
                <span className="manager__quot manager__quot--top"></span><p className="manager manager__text">{data.text}</p><span className="manager__quot manager__quot--bottom"></span>
            </div>
        </div>
    );
};

export default Manager;
