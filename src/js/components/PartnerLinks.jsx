import React from 'react';
import IconSprite from '../includes/IconSprite';

const PartnerLinks = () => {
    return (
        <div className="listing__partners">
            <div className="listing__partners--title">Еще больше объектов на сайтах партнеров</div>
            <div className="listing__cards">
                <div className="listing__partners--item">
                    <a className="listing__partners--card" href="http://" target="_blank" rel="noopener noreferrer">
                        <div className="listing__partners--pic">
                            <img
                                src="/img/pics/gagarinsky.png"
                                alt="gagarinsky"
                                className="listing__partners--img"
                            />
                        </div>
                        <div className="listing__partners--icon">
                            <IconSprite
                                selector="ExternalLinkIcon"
                                width="30"
                                height="30"
                                fill="#F9BC07"
                            />
                        </div>
                    </a>
                </div>
                <div className="listing__partners--item">
                    <a className="listing__partners--card" href="http://" target="_blank" rel="noopener noreferrer">
                        <div className="listing__partners--pic">
                            <img
                                src="/img/pics/yujnaya.png"
                                alt="yujnaya"
                                className="listing__partners--img"
                            />
                        </div>
                        <div className="listing__partners--icon">
                            <IconSprite
                                selector="ExternalLinkIcon"
                                width="30"
                                height="30"
                                fill="#F9BC07"
                            />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PartnerLinks;

