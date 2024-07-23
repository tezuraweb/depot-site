import React, { useState } from 'react';
import IconSprite from '../includes/IconSprite';
import { useViewportContext } from '../utils/ViewportContext';

const MainForm = ({ types = [], onSubmit, formData, setFormData }) => {
    const deviceType = useViewportContext();
    const [priceDesc, setPriceDesc] = useState(formData.priceDesc);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAreaChange = (e) => {
        const { value } = e.target;
        let from = '', to = '';

        if (value === '1') {
            to = '100';
        } else if (value === '2') {
            from = '100';
            to = '200';
        } else if (value === '3') {
            from = '200';
        }

        setFormData({
            ...formData,
            areaFrom: from,
            areaTo: to,
        });
    };

    const togglePriceOrder = () => {
        setFormData({
            ...formData,
            priceDesc: !priceDesc
        });
        setPriceDesc(prevState => !prevState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="form form--main">
            <div className="form__wrapper">
                <div className="form__group">
                    <label className="form__label">Тип</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="form__input form__input--select">
                        <option value="">Не выбрано</option>
                        {types.map(type => (
                            <option value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="form__group">
                    <label className="form__label">Площадь</label>
                    <select name="area" value={formData.area} onChange={handleAreaChange} className="form__input form__input--select">
                        <option value="">Не выбрано</option>
                        <option value="1">до 100</option>
                        <option value="2">100 - 200</option>
                        <option value="3">более 200</option>
                    </select>
                </div>
                <div className="form__group">
                    <div className="form__group form__group--inline form__group--marginBottom">
                        <label className="form__label form__label--inline">Стоимость</label>
                        <button type="button" onClick={togglePriceOrder} className="form__button--price">
                            <span className={`form__button--arrow ${priceDesc ? 'active' : ''}`}>↓</span>
                            <span className={`form__button--arrow ${priceDesc ? '' : 'active'}`}>↑</span>
                        </button>
                    </div>
                    <div className="form__group form__group--inline">
                        <div className="form__group form__group--inline form__group--marginRight">
                            <label className="form__label form__label--inline">От</label>
                            <input type="number" name="priceFrom" value={formData.priceFrom} onChange={handleChange} className="form__input form__input--number" />
                        </div>
                        <div className="form__group form__group--inline">
                            <label className="form__label form__label--inline">До</label>
                            <input type="number" name="priceTo" value={formData.priceTo} onChange={handleChange} className="form__input form__input--number" />
                        </div>
                    </div>
                </div>

                <div className="form__group form__group--hide">
                    <input type="checkbox" name="promotions" id="promotionCheckbox" checked={formData.promotions} onChange={handleChange} className="form__checkbox" />
                    <label className="form__label" htmlFor="promotionCheckbox">Акции</label>
                </div>
                <button type="submit" className="form__button button button--large animate--pulse">Показать</button>
            </div>

            <a className="form__link" href='/search'>
                <span>Расширенный поиск</span>
                {deviceType === 'mobile' && (
                    <IconSprite
                        selector="SearchIcon"
                        width="20"
                        height="20"
                    />
                )}
            </a>
        </form>
    );
};

export default MainForm;
