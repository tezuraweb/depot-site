import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardList from './CardList';
import LoadingSpinner from '../includes/LoadingSpinner';

const RentedCardList = () => {
    const [premisesData, setPremisesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/rented`)
            .then(response => {
                setPremisesData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>Error loading premises data: {error.message}</div>;
    }

    return (
        <div className="rented-card-list">
            <CardList
                cards={premisesData}
                modifier="rented"
            />
        </div>
    );
};

export default RentedCardList;
