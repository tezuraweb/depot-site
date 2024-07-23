import React, { useState, useEffect } from 'react';

import IconSprite from '../includes/IconSprite';

const images = Array.from({ length: 9 }, (_, index) => `/img/pics/showroom${index}.webp`);

const Gallery = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [canNavigate, setCanNavigate] = useState({ prev: false, next: true });

    useEffect(() => {
        setCanNavigate({
            prev: currentImage > 0,
            next: currentImage < images.length - 1
        });
    }, [currentImage]);

    const handlePrevious = () => {
        if (currentImage > 0) {
            setCurrentImage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentImage < images.length - 1) {
            setCurrentImage(prev => prev + 1);
        }
    };

    const handleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div className="gallery__container">
            <div className="gallery__frame flex">
                <img src={images[currentImage]} alt={`showroom ${currentImage}`} className={`gallery__frame--image ${isZoomed ? 'zoomed' : ''}`} onClick={handleZoom} />
                <div className="gallery__frame--bottom flex flex--col">
                    <div className="gallery__controls">
                        <button className="gallery__controls--button animate--prev" onClick={handlePrevious} disabled={!canNavigate.prev}>
                            <IconSprite
                                selector="PrevIcon"
                                width="40"
                                height="40"
                                fill="#F9BC07"
                            />
                        </button>
                        <button className="gallery__controls--button animate--next" onClick={handleNext} disabled={!canNavigate.next}>
                            <IconSprite
                                selector="NextIcon"
                                width="40"
                                height="40"
                                fill="#F9BC07"
                            />
                        </button>
                    </div>
                    <p className="gallery__description">Это единое пространство для размещения легких производств, организации хранения, офиса и шоурума.</p>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
