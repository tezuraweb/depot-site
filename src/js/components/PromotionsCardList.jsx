PromotionsCardList
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardList from './CardList';

const PromotionsCardList = () => {
    const [cards, setCards] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [isPromotion, setIsPromotion] = useState(false);
    const [promotionPrice, setPromotionPrice] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const cardsPerPage = 6;

    useEffect(() => {
        if (cards.length == 0) {
            fetchCards(0, cardsPerPage);
        }
    }, [cards]);

    useEffect(() => {
        setTotalPages(Math.ceil(totalCards / cardsPerPage));
    }, [cardsPerPage, totalCards]);

    const fetchCards = async (startIdx, endIdx) => {
        if (cards.length > startIdx) {
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
            return;
        }
        try {
            const response = await axios.post('/api/search', { startIdx, endIdx });
            setTotalCards(response.data.total);
            setTotalPages(Math.ceil(response.data.total / cardsPerPage));
            if (response.data.total === 0) {
                return;
            }
            setCards(prevCards => [...prevCards, ...response.data.rows]);
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (page) => {
        const startIdx = (page - 1) * cardsPerPage;
        const endIdx = page * cardsPerPage;
        setActiveCardIndex(null);
        fetchCards(startIdx, endIdx);
    };

    const setCardIndex = (index) => {
        const globalIndex = (currentPage - 1) * cardsPerPage + index;
        console.log(cards[globalIndex])
        setActiveCardIndex(globalIndex);
        setIsPromotion(cards[globalIndex]?.promotion);
        setPromotionPrice(cards[globalIndex]?.promotion_price);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const id = cards[activeCardIndex].id;
            const response = await axios.post('/api/promotions', { id, promotion: isPromotion, price: promotionPrice });
            // setCards([]);
            // setCurrentPage(1);
            // fetchCards(0, cardsPerPage);
        } catch (error) {
            console.error('Error updating promotions:', error);
        }
    };

    return (
        <>
            <CardList
                modifier="promotions"
                cards={cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalCards={totalCards}
                setActiveCardOuter={setCardIndex}
            />

            {activeCardIndex !== null && (
                <form className="form form--small" onSubmit={handleSubmit}>
                     <div className="form__group">
                        <input type="checkbox" name="promotions" id="promotionCheckbox" checked={isPromotion} onChange={(e) => setIsPromotion(e.target.checked)} className="form__checkbox" />
                        <label className="form__label" htmlFor="promotionCheckbox">Акции</label>
                    </div>
                    
                    <input
                        type="text"
                        name="telegramUsername"
                        placeholder="Имя пользователя Telegram"
                        value={promotionPrice}
                        onChange={(e) => setPromotionPrice(e.target.value)}
                        className="form__input"
                        required={isPromotion}
                    />

                    <button type="submit" className="form__button button">Сохранить</button>
                    {error && <div className="form__message form__message--red">{error}</div>}
                    {success && <div className="form__message form__message--green">{success}</div>}
                </form>
            )}
        </>
    );
};

export default PromotionsCardList;

