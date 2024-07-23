import React from 'react';
import ContactForm from './ContactForm';
import IconSprite from '../includes/IconSprite';

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero__column hero__column--left">
                <div className="hero__desc">ТОРГОВО-СКЛАДСКОЙ КОМПЛЕКС ДЕПО</div>
                <h1 className="hero__title">Аренда помещений в Ижевске</h1>
                <ContactForm modal={true} modifier="hero"/>
            </div>
            <div className="hero__column hero__column--right">
                <div className="hero__features">
                    <div className="hero__feature">
                        <div className="hero__feature--icon button button--icon">
                            <IconSprite
                                selector="HandshakeIcon"
                                width="30"
                                height="23.333"
                            />
                        </div>
                        <div className="hero__feature--text">Без посредников</div>
                    </div>

                    <div className="hero__feature">
                        <div className="hero__feature--icon button button--icon">
                            <IconSprite
                                selector="DocsIcon"
                                width="30"
                                height="30"
                            />
                        </div>
                        <div className="hero__feature--text">Сервис одного окна</div>
                    </div>

                    <div className="hero__feature">
                        <div className="hero__feature--icon button button--icon">
                            <IconSprite
                                selector="AreaIcon"
                                width="30"
                                height="30"
                            />
                        </div>
                        <div className="hero__feature--text">12 корпусов 66 000 м²</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;