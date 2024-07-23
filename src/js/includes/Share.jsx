import React from 'react';
import IconSprite from './IconSprite';
import ContactForm from '../components/ContactForm';

const Share = ({ activeCard, modifier }) => {
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Copied to clipboard');
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    };

    const generateSocialLink = (platform) => {
        if (activeCard) {
            const message = `Интересует лот ${link}`;
            const encodedMessage = encodeURIComponent(message);

            switch (platform) {
                case 'Telegram':
                    return `https://t.me/+79120557755?text=${encodedMessage}`;
                case 'Whatsapp':
                    return `https://api.whatsapp.com/send?phone=+79120557755&text=${encodedMessage}`;
                default:
                    return '#';
            }
        } else {
            switch (platform) {
                case 'Telegram':
                    return `https://t.me/+79120557755`;
                case 'Whatsapp':
                    return `https://wa.me/79120557755`;
                default:
                    return '#';
            }
        }
    };

    const handleSocialClick = (platform) => {
        if (activeCard) {
            const message = `Интересует лот артикул ${activeCard.article}`;
            copyToClipboard(message);
        }
        const link = generateSocialLink(platform);
        window.open(link, '_blank');
    };

    const link = activeCard ? window.location.origin + '/premises/' + activeCard.id : '';

    return (
        <div className={`share ${modifier ? 'share--' + modifier : ''}`}>
            <ul className="share__list">
                {modifier == 'phoneSmall' && (
                    <li className="share__item">
                        <ContactForm modal={true} modifier="share" buttonView="icon" url={link} />
                    </li>
                )}
                <li className="share__item">
                    <a onClick={() => handleSocialClick('Telegram')} className="share__link">
                        <IconSprite
                            selector="TelegramIcon"
                            width="30"
                            height="30"
                        />
                    </a>
                </li>
                <li className="share__item">
                    <a onClick={() => handleSocialClick('Whatsapp')} className="share__link">
                        <IconSprite
                            selector="WhatsappIcon"
                            width="30"
                            height="30"
                        />
                    </a>
                </li>
                {modifier == 'phoneLarge' && (
                    <>
                        <li className="share__item">
                            <a href="tel:+73412794040" className="share__phone">+7 (3412) 79-40-40</a>
                        </li>
                        <li className="share__item">
                            <ContactForm modal={true} modifier="share" url={link} />
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Share;
