import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SiteEditor = () => {
    const [managerData, setManagerData] = useState({
        name: '',
        text: '',
        photo: ''
    });
    const [managerSuccessMessage, setManagerSuccessMessage] = useState('');
    const [managerFailMessage, setManagerFailMessage] = useState('');

    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState('');
    const [tenantData, setTenantData] = useState({
        id: '',
        title: '',
        link: '',
        text: '',
        photo: ''
    });
    const [tenantSuccessMessage, setTenantSuccessMessage] = useState('');
    const [tenantFailMessage, setTenantFailMessage] = useState('');

    useEffect(() => {
        fetchManager();
        fetchTenants();
    }, []);

    const fetchManager = () => {
        axios.get('/api/manager')
            .then(response => setManagerData(response.data))
            .catch(error => console.error('Error fetching manager data:', error));
    };

    const fetchTenants = () => {
        axios.get('/api/tenants')
            .then(response => setTenants(response.data))
            .catch(error => console.error('Error fetching tenants list:', error));
    };

    const handleManagerChange = (e) => {
        const { name, value } = e.target;
        setManagerData({ ...managerData, [name]: value });
    };

    const handleTenantChange = (e) => {
        const { name, value } = e.target;
        setTenantData({ ...tenantData, [name]: value });
    };

    const handleTenantSelect = (e) => {
        const tenantId = e.target.value;
        setSelectedTenant(tenantId);
        if (tenantId === '') {
            setTenantData({ id: '', title: '', link: '', text: '', photo: '' });
        } else {
            const selected = tenants.find(tenant => tenant.id === tenantId);
            setTenantData(selected);
        }
    };

    const handleManagerSubmit = async (e) => {
        e.preventDefault();
        try {
            if (managerData.photoFile) {
                const photoUrl = await uploadPhoto(managerData.photoFile);
                console.log('here', photoUrl);
                setManagerData(prevData => ({ ...prevData, photo: photoUrl }));
            }
            await axios.post('/api/manager/update', managerData);
            showMessage('Данные успешно сохранены', setManagerSuccessMessage);
        } catch (error) {
            showMessage('Ошибка при сохранении данных', setManagerFailMessage);
        }
    };

    const handleTenantSubmit = async (e) => {
        e.preventDefault();
        try {
            if (tenantData.photoFile) {
                const photoUrl = await uploadPhoto(tenantData.photoFile);
                setTenantData(prevData => ({ ...prevData, photo: photoUrl }));
            }
            if (selectedTenant === '') {
                await axios.put('/api/tenants/create', tenantData);
            } else {
                await axios.post('/api/tenants/update', tenantData);
            }
            showMessage('Данные успешно сохранены', setTenantSuccessMessage);
            fetchTenants();
        } catch (error) {
            showMessage('Ошибка при сохранении данных', setTenantFailMessage);
        }
    };

    const handleTenantDelete = async () => {
        if (selectedTenant === '') return;
        try {
            await axios.delete(`/api/tenants/delete/${selectedTenant}`);
            showMessage('Данные успешно удалены', setTenantSuccessMessage);
            setTenantData({ id: '', title: '', link: '', text: '', photo: '' });
            setSelectedTenant('');
            fetchTenants();
        } catch (error) {
            showMessage('Ошибка при удалении данных', setTenantFailMessage);
        }
    };

    const uploadPhoto = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data)
            console.log(response.data.result)
            console.log(response.data.result.variants)
            return response.data.result.variants[0];
        } catch (error) {
            console.error('Ошибка при загрузке фотографии:', error);
            throw new Error('Ошибка при загрузке фотографии');
        }
    };

    const handlePhotoChange = (e, setData) => {
        const file = e.target.files[0];
        if (!file) return;
        setData(prevData => ({ ...prevData, photoFile: file }));
    };


    const showMessage = (message, msgSetter) => {
        msgSetter(message);
        setTimeout(() => {
            msgSetter('');
        }, 5000);
    }

    return (
        <div className="editor">
            <div className="editor__block">
                <h2 className="editor__title">Блок Управляющий</h2>
                <form className="form form--admin" onSubmit={handleManagerSubmit}>
                    <div className="form__group">
                        <label className="form__label">Изменить ФИО</label>
                        <input
                            className="form__input form__input--black"
                            type="text"
                            name="name"
                            value={managerData.name}
                            onChange={handleManagerChange}
                            placeholder="Введите ФИО"
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить текст</label>
                        <textarea
                            className="form__input form__input--black"
                            name="text"
                            rows="5"
                            value={managerData.text}
                            onChange={handleManagerChange}
                            placeholder="Введите текст"
                        ></textarea>
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить фотографию</label>
                        <input
                            className="form__input form__input--black"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoChange(e, setManagerData)}
                        />
                    </div>
                    <button className="button animate--pulse" type="submit">Сохранить</button>
                    {managerSuccessMessage && <div className="editor__message editor__message--green">{managerSuccessMessage}</div>}
                    {managerFailMessage && <div className="editor__message editor__message--red">{managerFailMessage}</div>}
                </form>
            </div>

            <div className="editor__block">
                <h2 className="editor__title">Блок Арендаторы</h2>
                <form className="form form--admin" onSubmit={handleTenantSubmit}>
                    <div className="form__group">
                        <label className="form__label">Выбрать арендатора</label>
                        <select
                            className="form__input form__input--black"
                            value={selectedTenant}
                            onChange={handleTenantSelect}
                        >
                            <option value="">Не выбрано</option>
                            {tenants.map(tenant => (
                                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить заголовок</label>
                        <input
                            className="form__input form__input--black"
                            type="text"
                            name="title"
                            value={tenantData.title}
                            onChange={handleTenantChange}
                            placeholder="Введите заголовок"
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить ссылку</label>
                        <input
                            className="form__input form__input--black"
                            type="text"
                            name="link"
                            value={tenantData.link}
                            onChange={handleTenantChange}
                            placeholder="Введите ссылку"
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить текст</label>
                        <textarea
                            className="form__input form__input--black"
                            name="text"
                            rows="5"
                            value={tenantData.text}
                            onChange={handleTenantChange}
                            placeholder="Введите текст"
                        ></textarea>
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить фотографию</label>
                        <input
                            className="form__input form__input--black"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoChange(e, setTenantData)}
                        />
                    </div>

                    <div className="flex flex--sb">
                        <button className="button animate--pulse" type="submit">Сохранить</button>
                        <button
                            className="button button--grey animate--pulse"
                            type="button"
                            onClick={handleTenantDelete}
                        >
                            Удалить
                        </button>
                    </div>

                    {tenantSuccessMessage && <div className="editor__message editor__message--green">{tenantSuccessMessage}</div>}
                    {tenantFailMessage && <div className="editor__message editor__message--red">{tenantFailMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default SiteEditor;
