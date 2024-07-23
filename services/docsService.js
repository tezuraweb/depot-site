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

async function getDocsByTenant(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT 
            documents.id, 
            documents.doctype, 
            documents.docname, 
            documents.status, 
            documents.docdate, 
            documents.docexpire
        FROM documents 
        JOIN tenants 
        ON documents.tenant = tenants.id 
        WHERE tenants.id = ${sanitizedId} 
        FORMAT JSON`;
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

module.exports = {
    getDocsByTenant,
};
