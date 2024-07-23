import React, { useState, useEffect } from 'react';
import Card from '../includes/Card';
import Share from '../includes/Share';
import IconSprite from '../includes/IconSprite';
import { useViewportContext } from '../utils/ViewportContext';

const CardList = ({ types = [], cards = [], currentPage = 0, totalPages = 0, onPageChange = null, modifier = '', totalCards = 0, activeTab, setActiveTab, noResults = false, setActiveCardOuter = null }) => {
    const deviceType = useViewportContext();
    const [activeCardIndex, setActiveCardIndex] = useState(null);

    useEffect(() => {
        if (deviceType !== 'desktop' && deviceType !== 'laptop' && modifier === 'main') {
            setActiveCardIndex(0);
        }
    }, []);

    useEffect(() => {
        if (deviceType !== 'desktop' && deviceType !== 'laptop' && modifier === 'main') {
            setActiveCardIndex(0);
        } else {
            setActiveCardIndex(null);
        }
    }, [currentPage]);

    const handleCardClick = (card, index) => {
        if (modifier === 'recommend' || modifier === 'rented') return;
        setActiveCardIndex(index);
        if (setActiveCardOuter) {
            setActiveCardOuter(index);
        }
    };

    const handleTabClick = (type) => {
        setActiveTab(type);
    };

    const titleMap = {
        main: 'Свободные помещения',
        search: 'Найдено для вас',
        recommend: 'Мы подобрали помещения, которые максимально похожи по стоимости аренды и площади',
        rented: 'Помещения в аренде'
    };

    const title = titleMap[modifier];
    const showTabs = modifier === 'main';
    const showPagination = modifier === 'main' && deviceType !== 'tablet' && deviceType !== 'mobile' || modifier === 'search' || modifier === 'promotions';
    const showRedirect = modifier === 'main' && (deviceType === 'tablet' || deviceType === 'mobile');
    const showShareSide = modifier === 'main' && (deviceType === 'desktop' || deviceType === 'laptop');
    const showShareBottom = modifier === 'main' && (deviceType === 'tablet' || deviceType === 'mobile') || modifier === 'search';
    const showAdvantages = modifier === 'main' && (deviceType === 'tablet' || deviceType === 'mobile');

    return (
        <div className={`listing ${modifier ? 'listing--' + modifier : ''}`}>
            {title && <h2 className="listing__title">{title}</h2>}

            {showTabs && (
                <div className="listing__tabs">
                    {types.map(type => (
                        <button
                            key={type}
                            className={`listing__tab ${activeTab === type ? 'active' : ''}`}
                            onClick={() => handleTabClick(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            )}

            <div className="listing__content">
                <div className="listing__column listing__column--left">
                    {noResults ? (
                        <div className="no-results">Ничего не найдено</div>
                    ) : (
                        <div className="listing__cards">
                            {cards.map((card, index) => (
                                <Card
                                    key={index}
                                    card={card}
                                    onClick={() => handleCardClick(card, index)}
                                    isActive={index === activeCardIndex}
                                    modifier={modifier}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {showPagination && (
                    <div className="listing__column listing__column--right">
                        <div className="listing__pagination">
                            <div className="listing__pagination--line">
                                <button
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="listing__pagination--button animate--prev"
                                    aria-label="Предыдущая страница"
                                >
                                    <IconSprite
                                        selector="PrevIcon"
                                        width="40"
                                        height="40"
                                    />
                                </button>
                                <button
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="listing__pagination--button animate--next"
                                    aria-label="Следующая страница"
                                >
                                    <IconSprite
                                        selector="NextIcon"
                                        width="40"
                                        height="40"
                                    />
                                </button>
                            </div>
                            <div className="listing__pagination--info">
                                Стр. {currentPage}/{totalPages}
                            </div>
                        </div>

                        {showShareSide && (
                            <Share activeCard={activeCardIndex !== null ? cards[activeCardIndex] : null} modifier='phoneSmall' />
                        )}
                    </div>
                )}

                {showAdvantages && (
                    <div className="listing__column listing__column--right">
                        <div className="listing__points">
                            <div className="listing__point">
                                <div className="button button--icon">
                                    <IconSprite
                                        selector="HoursIcon"
                                        width="26"
                                        height="26"
                                    />
                                </div>
                                <div className="listing__point--text">Круглосуточный доступ</div>
                            </div>
                            <div className="listing__point">
                                <div className="button button--icon">
                                    <IconSprite
                                        selector="ParkingIcon"
                                        width="31"
                                        height="30"
                                    />
                                </div>
                                <div className="listing__point--text">Вместительный паркинг</div>
                            </div>
                            <div className="listing__point">
                                <div className="button button--icon">
                                    <IconSprite
                                        selector="CanteenIcon"
                                        width="27"
                                        height="26"
                                    />
                                </div>
                                <div className="listing__point--text">Столовая на территории комплекса</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showRedirect && (
                <div className="listing__redirect">
                    <div className="listing__redirect--text">Свободных помещений: <span className="listing__redirect--yellow">{totalCards}</span></div>
                    <a className="listing__redirect--link button" href="/search">Смотреть еще</a>
                </div>
            )}

            {showShareBottom && (
                <Share activeCard={activeCardIndex !== null ? cards[activeCardIndex] : null} modifier='phoneLarge' />
            )}
        </div>
    );
};

export default CardList;
