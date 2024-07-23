import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from './Hero';
import MainForm from './MainForm';
import CardList from './CardList';
import { useViewportContext } from '../utils/ViewportContext';

const MainFilter = () => {
    const deviceType = useViewportContext();
    const [cards, setCards] = useState([]);
    const [types, setTypes] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [noResults, setNoResults] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        areaFrom: '',
        areaTo: '',
        priceFrom: '',
        priceTo: '',
        promotions: false,
        priceDesc: false
    });

    const cardsPerPage = deviceType === 'desktop' ? 6 : deviceType === 'laptop' ? 4 : 1;

    useEffect(async () => {
        try {
            const response = await axios.get('/api/search/types');
            setTypes(response.data.map(item => item.type));
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    }, []);

    useEffect(() => {
        setNoResults(false);
        if (cards.length == 0) {
            fetchCards(0, cardsPerPage, formData);
        }
    }, [cards]);

    useEffect(() => {
        setTotalPages(Math.ceil(totalCards / cardsPerPage));
    }, [cardsPerPage, totalCards]);

    useEffect(() => {
        const startIdx = (currentPage - 1) * cardsPerPage;
        const endIdx = currentPage * cardsPerPage;
        if (cards.length > startIdx && cards.length < endIdx) {
            fetchCards(cards.length, endIdx, formData);
        }
    }, [deviceType]);

    const handleFormSubmit = async () => {
        // setFormData(data);
        setActiveType(formData.type);
        setCards([]);
    };

    const fetchCards = async (startIdx, endIdx, data) => {
        if (cards.length > startIdx) {
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
            return;
        }
        try {
            const requestData = { ...data, startIdx, endIdx };
            const response = await axios.post('/api/search', requestData);
            setTotalCards(response.data.total);
            setTotalPages(Math.ceil(response.data.total / cardsPerPage));
            if (response.data.total === 0) {
                setNoResults(true);
                return;
            }
            setCards(prevCards => [...prevCards, ...response.data.rows]);
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const setActiveType = (tabType) => {
        setFormData({
            ...formData,
            type: tabType,
        });
        setCards([]);
    };

    const handlePageChange = (page) => {
        const startIdx = (page - 1) * cardsPerPage;
        const endIdx = page * cardsPerPage;
        fetchCards(startIdx, endIdx, formData);
    };

    return (
        <>
            <section className="section" id="hero">
                <div className="container">
                    <Hero showSearchIcon={deviceType === 'mobile' ? true : false} />
                    <MainForm
                        types={types}
                        onSubmit={handleFormSubmit}
                        formData={formData}
                        setFormData={setFormData}
                        showSearchIcon={deviceType === 'mobile' ? true : false}
                    />
                </div>
            </section>

            <section className="section" id="main-listing">
                <div className="container">
                    <CardList
                        modifier="main"
                        types={types}
                        cards={cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalCards={totalCards}
                        activeTab={formData.type}
                        setActiveTab={setActiveType}
                        noResults={noResults}
                    />
                </div>
            </section>
        </>
    );
};

export default MainFilter;

