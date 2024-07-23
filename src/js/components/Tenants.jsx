import React, { useState, useEffect } from 'react';
import axios from 'axios';

import IconSprite from '../includes/IconSprite';

const Accordion = () => {
    const [activeElement, setActiveElement] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get('/api/tenants');
                setData(response.data);
            } catch (error) {
                setData([]);
                console.error('Error fetching tenants', error);
            }
        };

        fetchTenants();
    }, []);

    return (
        <div className="about__accordion">
            {data.map((item, index) => (
                <div key={index} className="about__accordion--item">
                    <div className="about__accordion--header flex flex--sb flex--center">
                        <div className="about__accordion--headerWrapper flex flex--center">
                            <img className="about__accordion--image" src={item.logo} alt={item.title} />
                            <div className="about__accordion--title">{item.title}</div>
                        </div>
                        <button
                            onClick={() => setActiveElement(activeElement === index ? null : index)}
                            className={`button--droplist about__accordion--toggle ${activeElement === index ? 'active' : ''}`}
                        ></button>
                    </div>
                    <div className={`about__accordion--wrapper ${activeElement === index ? 'active' : ''}`}>
                        <div className="about__accordion--content">
                            <div className="about__accordion--subtitle">{item.title}</div>
                            <a href={item.link} className="">
                                <IconSprite
                                    selector="ExternalLinkIcon"
                                    width="30"
                                    height="30"
                                    fill="#1C1D20"
                                />
                            </a>
                            <p>{item.text}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
};

export default Accordion;
