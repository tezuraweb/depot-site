import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IconSprite from '../includes/IconSprite';

const Report = ({ base = '' }) => {
    const [data, setData] = useState({
        total: 0,
        rented: 0,
        available: 0,
        rented_percentage: 0,
        available_percentage: 0
    });
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = base !== '' ? `/api/report/${base}` : `/api/report/depot`
                const response = await axios.get(url);
                if (response.data?.length > 0) {
                    const list = response.data.map(item => {
                        const total = parseInt(item.total);
                        const rented = parseInt(item.rented);
                        let type_percentage = parseFloat(item.type_percentage);
                        let rented_percentage = parseFloat(item.rented_percentage);

                        if (isNaN(total) || isNaN(rented) || isNaN(type_percentage) || isNaN(rented_percentage)) {
                            throw 'Invalid data';
                        }

                        type_percentage = Math.round(type_percentage);
                        rented_percentage = Math.round(rented_percentage);

                        return {
                            type: item.type,
                            total: total,
                            rented: rented,
                            available: total - rented,
                            type_percentage: type_percentage,
                            rented_percentage: rented_percentage,
                            available_percentage: 100 - rented_percentage,
                        }
                    });

                    const aggregatedData = list.reduce((acc, curr) => {
                        acc.total += curr.total;
                        acc.rented += curr.rented;
                        return acc;
                    }, {
                        total: 0,
                        rented: 0,
                    });

                    aggregatedData.available = aggregatedData.total - aggregatedData.rented;
                    aggregatedData.rented_percentage = Math.round(aggregatedData.rented / aggregatedData.total * 100);
                    aggregatedData.available_percentage = 100 - aggregatedData.rented_percentage;

                    setData(aggregatedData);
                    setTypes(list);
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        fetchData();
    }, []);

    const getIconName = (type) => {
        switch (type) {
            case 'Торговое':
                return 'CommercialPremises';
            case 'Холодный склад':
                return 'RefrigeratorPremises';
            case 'Производственно-складское':
                return 'WarehousePremises';
            case 'Офис':
                return 'OfficePremises';
            case 'Участок':
                return 'SitePremises';
            default:
                return '';
        }
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="report">
            <div className="report__header">
                <div className="report__title">
                    <h1 className="report__h1">АО “Депо”</h1>
                    <h2 className="report__h2">Отчет данных аренды</h2>
                </div>
                <div className="report__date">
                    <p>Дата формирования отчета: <br /> {new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button className="report__print button button--icon" onClick={handlePrint}>
                    <IconSprite
                        selector="PrinterIcon"
                        width="30"
                        height="30"
                    />
                </button>
            </div>

            <div className="report__summary">
                <h3 className="report__h3">Общие показатели</h3>
                <div className="report__metrics">
                    <div className="report__metric">
                        <p>Всего помещений:</p>
                        <p className="report__metric--large">{data.total}</p>
                    </div>
                    <div className="report__metric report__metric--green">
                        <p>В аренде: {data.rented}</p>
                        <p className="report__metric--large">{data.rented_percentage}%</p>
                    </div>
                    <div className="report__metric report__metric--red">
                        <p>Свободно: {data.available}</p>
                        <p className="report__metric--large">{data.available_percentage}%</p>
                    </div>
                </div>
            </div>

            <div className="report__ratio">
                <h3 className="report__h3">Соотношение по типам помещений от общего числа</h3>
                <div className="report__metrics">
                    {types.map((type) => (
                        <div className="report__metric" key={type.type}>
                            <p>{type.type}</p>
                            <p className="report__metric--large">{type.type_percentage}%</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="report__status">
                <h3 className="report__h3">Статус по типам</h3>
                {types.map((type) => (
                    <div className="report__block" key={type.type}>
                        <h4 className="report__h4">
                            <div className="report__icon">
                                <IconSprite
                                    selector={getIconName(type.type)}
                                    width="30"
                                    height="30"
                                />
                            </div>
                            <span>{type.type}</span>
                        </h4>
                        <div className="report__bar">
                            <div className={`report__percentage ${type.rented == type.total ? 'report__percentage--green' : (type.rented == 0 ? 'report__percentage--red' : 'report__percentage--yellow')}`} style={{ width: `${type.rented_percentage}%` }}>{type.rented_percentage}%</div>
                            <div className={`report__percentage ${type.available == type.total ? 'report__percentage--red' : (type.available == 0 ? 'report__percentage--green' : 'report__percentage--grey')}`} style={{ width: `${type.available_percentage}%` }}>{type.available_percentage}%</div>
                        </div>
                        <div className="report__metrics report__metrics--sb">
                            <div className="report__metric">
                                <p>В Аренде</p>
                                <p>{type.rented} <span className="report__metric--thin">из {type.total}</span></p>
                            </div>
                            <div className="report__metric report__metric--right">
                                <p>Свободно</p>
                                <p>{type.available} <span className="report__metric--thin">из {type.total}</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Report;
