import React, { useState, useEffect } from 'react';

import IconSprite from '../includes/IconSprite';

const blocks = [
    {
        id: 1,
        image: '/img/pics/presentation1.webp',
        text: 'Блоки в LIGHT INDUSTRIAL небольшие и начинаются от 100 м², а в среднем составляют 300-1000 м².'
    },
    {
        id: 2,
        image: '/img/pics/presentation2.webp',
        text: 'LIGHT INDUSTRIAL – это качественные производственно-складские помещения для малого и среднего бизнеса с отдельным входом, воротами, выделенной складской зоной и небольшим административным блоком. Высота потолка достигает 6-10 метров.'
    },
    {
        id: 3,
        image: '/img/pics/presentation3.webp',
        text: 'Вам предоставляются площади с отдельным боксом и возможностью организовать офисное пространство.'
    },
    {
        id: 4,
        image: '/img/pics/presentation4.webp',
        text: 'Light industrial – Это формат недвижимости, который отличается высоким качеством, функциональностью и удобством использования.'
    }
];

const Presentation = () => {
    const [currentBlock, setCurrentBlock] = useState(0);
    const [direction, setDirection] = useState('forward');

    const nextBlock = () => {
        if (direction === 'forward') {
            if (currentBlock < blocks.length - 1) {
                setCurrentBlock(currentBlock + 1);
            } else {
                setDirection('backward');
                setCurrentBlock(currentBlock - 1);
            }
        } else {
            if (currentBlock > 0) {
                setCurrentBlock(currentBlock - 1);
            } else {
                setDirection('forward');
                setCurrentBlock(currentBlock + 1);
            }
        }
    };

    return (
        <div className="presentation__container">
            <div className="presentation__block flex" style={{ backgroundImage: `url(${blocks[currentBlock].image})` }}>
                <div className="presentation__info flex flex--sb flex--center">
                    <div className="presentation__text">{blocks[currentBlock].text}</div>
                    <div className="presentation__controls">
                        <button onClick={nextBlock} className={direction === 'backward' ? 'reversed' : ''}>
                            <IconSprite
                                selector="NextIcon"
                                width="40"
                                height="40"
                                fill="#F9BC07"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Presentation;
