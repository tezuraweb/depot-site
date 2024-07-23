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

function generateUniqueTicketNumber() {
    return Math.floor(Math.random() * 1000000000);
}

async function getTicketById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `SELECT * FROM ticket WHERE id = ${sanitizedId} FORMAT JSON`;
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

async function getTicketsByTenant(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT ticket.text, ticket.ticket_number, ticket.status, ticket.date, ticket.manager
        FROM ticket 
        JOIN tenants 
        ON ticket.inquirer_username = tenants.tg_user 
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

async function getTicketByUserTg(id, offset, limit) {
    const sanitizedId = sqlstring.escape(id);
    const sanitizedOffcet = sqlstring.escape(offset);
    const sanitizedLimit = sqlstring.escape(limit);
    const query = `
        SELECT * 
        FROM (
            SELECT *, 
                row_number() OVER (PARTITION BY ticket_number ORDER BY date) AS rn
            FROM ticket 
            WHERE inquirer = ${sanitizedId}
            AND status != 'closed'
        ) 
        WHERE rn = 1
        ORDER BY ticket_number
        LIMIT ${sanitizedLimit} OFFSET ${sanitizedOffcet}
        FORMAT JSON
    `;
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

async function getTicketByNumber(number) {
    const sanitizedNumber = sqlstring.escape(number);
    const query = `
        SELECT * FROM ticket WHERE ticket_number = ${sanitizedNumber} ORDER BY date FORMAT JSON`;

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

async function getTicketByStatusTg(status, offset, limit) {
    const sanitizedStatus = sqlstring.escape(status);
    const sanitizedOffcet = sqlstring.escape(offset);
    const sanitizedLimit = sqlstring.escape(limit);
    const query = `
        SELECT * 
        FROM (
            SELECT *, 
                row_number() OVER (PARTITION BY ticket_number ORDER BY date) AS rn
            FROM ticket 
            WHERE status = ${sanitizedStatus}
        ) 
        WHERE rn = 1
        ORDER BY ticket_number
        LIMIT ${sanitizedLimit} OFFSET ${sanitizedOffcet}
        FORMAT JSON
    `;
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

async function updateTicketStatus(data) {
    const sanitizedNumber = sqlstring.escape(data.ticket_number);
    const sanitizedStatus = sqlstring.escape(data.status);
    
    const query = `
        ALTER TABLE ticket
        UPDATE status = ${sanitizedStatus}
        WHERE ticket_number = ${sanitizedNumber}
    `;
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

async function insertTicket(data) {
    if (data.isNew) {
        data.ticket_number = generateUniqueTicketNumber();
        data.status = 'new';
    } else {
        data.status = 'in_process';
    }
    data.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    delete data.isNew;

    const keys = Object.keys(data).map(key => sqlstring.escapeId(key)).join(', ');
    const values = Object.keys(data).map(key => {
        if (Array.isArray(data[key])) {
            if (data[key].length > 0) {
                return `['${data[key].map(item => sqlstring.escape(item).replace(/'/g, "")).join("', '")}']`;
            } else {
                return `[]`;
            }
        }
        return sqlstring.escape(data[key]);
    }).join(', ');

    const query = `INSERT INTO ticket (${keys}) VALUES (${values})`;
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

async function insertTicketBackoffice(data) {
    data.ticket_number = generateUniqueTicketNumber();
    data.status = 'new';
    data.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const userId = sqlstring.escape(data.userId);

    const inquirerUsernameSubquery = `(SELECT tg_user FROM tenants WHERE id = ${userId} LIMIT 1)`;
    const inquirerSubquery = `(SELECT tg_id FROM tenants WHERE id = ${userId} LIMIT 1)`;

    const keys = ['ticket_number', 'status', 'date', 'text', 'inquirer_username', 'inquirer'];
    const values = [
        sqlstring.escape(data.ticket_number),
        sqlstring.escape(data.status),
        sqlstring.escape(data.date),
        sqlstring.escape(data.text),
        inquirerUsernameSubquery,
        inquirerSubquery
    ];

    const query = `INSERT INTO ticket (${keys.join(', ')}) VALUES (${values.join(', ')})`;
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
    getTicketById,
    insertTicket,
    insertTicketBackoffice,
    getTicketByUserTg,
    getTicketByStatusTg,
    getTicketByNumber,
    updateTicketStatus,
    getTicketsByTenant
};
