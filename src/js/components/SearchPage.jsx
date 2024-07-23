import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchForm from './SearchForm';
import CardList from './CardList';
import Scheme from './ModalScheme';
import { useViewportContext } from '../utils/ViewportContext';

const SearchPage = () => {
    const deviceType = useViewportContext();
    const [cards, setCards] = useState([]);
    const [types, setTypes] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [noResults, setNoResults] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        building: null,
        areaFrom: '',
        areaTo: '',
        priceFrom: '',
        priceTo: '',
        storey: '',
        rooms: '',
        ceilingHeight: '',
        promotions: false,
        priceDesc: false,
        priceType: 'total',
    });

    const cardsPerPage = deviceType === 'desktop' ? 6 : deviceType === 'laptop' ? 4 : 2;

    useEffect(async () => {
        try {
            const response = await axios.get('/api/search/types');
            setTypes(response.data.map(item => item.type));
        } catch (error) {
            console.error('Error fetching types:', error);
        }

        try {
            const response = await axios.get('/api/search/buildings');
            const data = response.data.filter((item) => item.key_liter != '');
            setBuildings(data);
        } catch (error) {
            console.error('Error fetching buildings:', error);
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

    const handlePageChange = (page) => {
        const startIdx = (page - 1) * cardsPerPage;
        const endIdx = page * cardsPerPage;
        fetchCards(startIdx, endIdx, formData);
    };

    return (
        <>
            <section className="section" id="search-block">
                <div className="search container">
                    <h1 className="search__heading section__title">Подобрать помещение</h1>
                    <div className="search__row">
                        <div className="search__column">
                            <SearchForm
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={handleFormSubmit}
                                types={types}
                                buildings={buildings}
                            />
                        </div>
                        {(deviceType === 'desktop' || deviceType === 'laptop') && (
                            <div className="search__column search__column--flex">
                                <div className="search__map">
                                    <Scheme
                                        buildings={buildings}
                                        selectedElement={formData.building}
                                        isModal={true}
                                    />
                                </div>
                                <div className="search__info">
                                    <div className="search__colors">
                                        <div className="search__title">Карта обозначений</div>
                                        <div className="search__color">
                                            <div className="search__palette search__palette--yellow"></div>
                                            <div className="search__desc">Доступный объект</div>
                                        </div>
                                        <div className="search__color">
                                            <div className="search__palette search__palette--grey"></div>
                                            <div className="search__desc">Недоступный объект</div>
                                        </div>
                                        <div className="search__color">
                                            <div className="search__palette search__palette--red"></div>
                                            <div className="search__desc">Выбранный объект</div>
                                        </div>
                                    </div>
                                    <div className="search__facilities"></div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            <section className="section" id="search-listing">
                <div className="container">
                    <CardList
                        modifier="search"
                        cards={cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        noResults={noResults}
                    />
                </div>
            </section>
        </>
    );
};

export default SearchPage;
