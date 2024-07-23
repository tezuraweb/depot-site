import React, { useState } from 'react';

const SearchForm = ({ onSubmit, types = [], buildings = [], formData, setFormData }) => {
    const [priceDesc, setPriceDesc] = useState(false);

    const priceRanges = {
        total: ['', 10000, 20000, 30000, 40000, 50000],
        perSquareMeter: ['', 100, 200, 300, 400, 500]
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => {
            const updatedFormData = { ...prevState, [name]: value };

            if (name === 'priceFrom') {
                if (value && (updatedFormData.priceTo && parseInt(updatedFormData.priceTo) < parseInt(value))) {
                    updatedFormData.priceTo = value;
                }
            } else if (name === 'priceTo') {
                if (value && (updatedFormData.priceFrom && parseInt(updatedFormData.priceFrom) > parseInt(value))) {
                    updatedFormData.priceFrom = value;
                }
            }
            return updatedFormData;
        });
    };

    const handleAreaChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => {
            const updatedFormData = { ...prevState, [name]: value };

            if (name === 'areaFrom') {
                if (value && (updatedFormData.areaTo && parseInt(updatedFormData.areaTo) < parseInt(value))) {
                    updatedFormData.areaTo = value;
                }
            } else if (name === 'areaTo') {
                if (value && (updatedFormData.areaFrom && parseInt(updatedFormData.areaFrom) > parseInt(value))) {
                    updatedFormData.areaFrom = value;
                }
            }
            return updatedFormData;
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
        <form onSubmit={handleSubmit} className="form form--search">
            <div className="form__section form__section--framed">
                <div className="form__group form__group--inline form__group-1">
                    <label className="form__label form__label--inline">Тип</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="form__input form__input--select">
                        <option value="">Не выбрано</option>
                        {types.map(type => (
                            <option value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form__group form__group--inline form__group-2">
                    <label className="form__label form__label--inline">Корпус</label>
                    <select name="building" value={formData.building} onChange={handleChange} className="form__input form__input--select">
                        <option value="">Не выбрано</option>
                        {buildings.map(building => (
                            <option value={building.key_liter_id}>{building.key_liter}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form__section form__section--framed">
                <div className="form__grid">
                    <div className="form__cell form__cell-1">
                        <label className="form__label form__label--inline">Площадь</label>
                    </div>

                    <div className="form__cell form__cell-2">
                        <input type="number" name="areaFrom" value={formData.areaFrom} onChange={handleAreaChange} className="form__input form__input--number" />
                    </div>

                    <div className="form__cell form__cell-3">
                        <div className="form__hatch"></div>
                    </div>

                    <div className="form__cell form__cell-4">
                        <input type="number" name="areaTo" value={formData.areaTo} onChange={handleAreaChange} className="form__input form__input--number" />
                    </div>

                    <div className="form__cell form__cell-5">
                        <label className="form__label form__label--inline">Стоимость</label>
                    </div>

                    <div className="form__cell form__cell-6">
                        <input className="form__radio" type="radio" id="totalPrice" name="priceType" value="total" checked={formData.priceType === 'total'} onChange={handleChange} />
                        <label htmlFor="totalPrice">Общая</label>
                    </div>

                    <div className="form__cell form__cell-7"></div>

                    <div className="form__cell form__cell-8">
                        <input className="form__radio" type="radio" id="perSquareMeterPrice" name="priceType" value="perSquareMeter" checked={formData.priceType === 'perSquareMeter'} onChange={handleChange} />
                        <label htmlFor="perSquareMeterPrice">за м²</label>
                    </div>

                    <div className="form__cell form__cell-9">
                        <button type="button" onClick={togglePriceOrder} className="form__button--price">
                            <span className={`form__button--arrow ${priceDesc ? 'active' : ''}`}>↓</span>
                            <span className={`form__button--arrow ${priceDesc ? '' : 'active'}`}>↑</span>
                        </button>
                    </div>

                    <div className="form__cell form__cell-10">
                        <select name="priceFrom" value={formData.priceFrom} onChange={handlePriceChange} className="form__input form__input--select">
                            {priceRanges[formData.priceType].map((price, index) => (
                                <option key={index} value={price}>{price || 'Не выбрано'}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form__cell form__cell-11">
                        <div className="form__hatch"></div>
                    </div>

                    <div className="form__cell form__cell-12">
                        <select name="priceTo" value={formData.priceTo} onChange={handlePriceChange} className="form__input form__input--select">
                            {priceRanges[formData.priceType].map((price, index) => (
                                <option key={index} value={price}>{price || 'Не выбрано'}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form__section form__section--framed form__section--column">
                <div className="form__group form__group--inline form__group--spread form__group--marginBottom">
                    <label className="form__label form__label--inline">Этаж</label>
                    <select name="storey" value={formData.storey} onChange={handleChange} className="form__input form__input--select">
                        <option value="">Не выбрано</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>

                <div className="form__group form__group--inline form__group--spread form__group--marginBottom">
                    <label className="form__label form__label--inline">Количество комнат</label>
                    <select name="rooms" value={formData.rooms} onChange={handleChange} className="form__input form__input--select">
                        <option value="">Не выбрано</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>

                <div className="form__group form__group--inline form__group--spread">
                    <label className="form__label form__label--inline">Высота потолков</label>
                    <select name="ceilingHeight" value={formData.ceilingHeight} onChange={handleChange} className="form__input form__input--select">
                        <option value="">Не выбрано</option>
                        <option value="2.5">2.5 м</option>
                        <option value="3.0">3.0 м</option>
                        <option value="3.5">3.5 м</option>
                    </select>
                </div>
            </div>

            <div className="form__section">
                <div className="form__section--framed form__promotion">
                    <div className="form__promotion--wrapper">
                        <input type="checkbox" name="promotions" id="promotionCheckbox" checked={formData.promotions} onChange={handleChange} className="form__checkbox" />
                        <label className="form__label" htmlFor="promotionCheckbox">Акции</label>
                    </div>
                </div>

                <button type="submit" className="form__button button button--large animate--pulse">Показать</button>
            </div>
        </form>
    );
};

export default SearchForm;
