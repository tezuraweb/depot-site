const axios = require('axios');
const querystring = require('querystring');
const sqlstring = require('sqlstring');
const config = require('../config/dbConfig');

const dbOptions = {
    baseURL: `https://${config.host}:8443`,
    method: 'POST',
    headers: {
        'X-ClickHouse-User': config.user,
        'X-ClickHouse-Key': config.password,
    },
    httpsAgent: new (require('https').Agent)({
        ca: config.ca,
    }),
};

async function getTenantById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `SELECT * FROM tenants WHERE id = ${sanitizedId} FORMAT JSON`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios({
            ...dbOptions,
            method: 'GET',
            url: `/?${queryParams}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getTenantByParam(params) {
    const conditions = Object.keys(params)
        .map(key => `${sqlstring.escapeId(key)} = ${sqlstring.escape(params[key])}`)
        .join(' AND ');

    let fields = '*';
    if (params.hasOwnProperty('tg_user')) {
        fields = 'id, name, tg_user, tg_id, status';
    } else {
        fields = 'id, name, email, tin, password, status, tg_user, tg_id';
    }

    const query = `SELECT ${fields} FROM tenants WHERE ${conditions} LIMIT 1 FORMAT JSON`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios({
            ...dbOptions,
            method: 'GET',
            url: `/?${queryParams}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function insertTenant(data) {
    const keys = Object.keys(data).map(key => sqlstring.escapeId(key)).join(', ');
    const values = Object.keys(data).map(key => sqlstring.escape(data[key])).join(', ');
    const query = `INSERT INTO tenants (${keys}) VALUES (${values})`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios.post(`/?${queryParams}`, null, dbOptions);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function deleteTenantById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `ALTER TABLE tenants DELETE WHERE id = ${sanitizedId}`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios.post(`/?${queryParams}`, null, dbOptions);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function alterTenantById(id, data) {
    const updates = Object.keys(data).map(key => `${sqlstring.escapeId(key)} = ${sqlstring.escape(data[key])}`).join(', ');
    const query = `ALTER TABLE tenants UPDATE ${updates} WHERE id = ${sqlstring.escape(id)}`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios.post(`/?${queryParams}`, null, dbOptions);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getTenantById,
    getTenantByParam,
    alterTenantById,
};
