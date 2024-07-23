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

const organization = 'ДЕПО АО';

async function getAll() {
    const query = `SELECT * FROM rooms WHERE organization = ${sqlstring.escape(organization)} FORMAT JSON`;
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

async function getTypes() {
    const query = `SELECT DISTINCT type FROM rooms WHERE organization = ${sqlstring.escape(organization)} FORMAT JSON`;
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

async function getIdLiter() {
    const query = `SELECT DISTINCT key_liter, key_liter_id FROM rooms WHERE organization = ${sqlstring.escape(organization)} FORMAT JSON`; //where status == vacant
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

async function getRoomsByTenant(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT 
            rooms.id, 
            rooms.room, 
            rooms.type, 
            rooms.liter, 
            rooms.id_liter, 
            rooms.cost, 
            rooms.area, 
            rooms.floor, 
            rooms.ceiling, 
            rooms.promotion,
            rooms.date_d
        FROM rooms 
        JOIN tenants 
        ON rooms.tenant = tenants.id 
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

async function getPage(data) {
    const conditions = [];

    if (data.type) conditions.push(`type = ${sqlstring.escape(data.type)}`);
    if (data.id_liter) conditions.push(`key_liter_id = ${sqlstring.escape(data.id_liter)}`);
    if (data.floor) conditions.push(`floor = ${sqlstring.escape(data.floor)}`);
    if (data.ceiling) conditions.push(`ceiling = ${sqlstring.escape(data.ceiling)}`);
    if (data.promotion) conditions.push(`promotion = ${sqlstring.escape(data.promotion)}`);

    if (data.areaFrom !== undefined && data.areaTo !== undefined) {
        conditions.push(`area BETWEEN ${sqlstring.escape(data.areaFrom)} AND ${sqlstring.escape(data.areaTo)}`);
    } else if (data.areaFrom !== undefined) {
        conditions.push(`area >= ${sqlstring.escape(data.areaFrom)}`);
    } else if (data.areaTo !== undefined) {
        conditions.push(`area <= ${sqlstring.escape(data.areaTo)}`);
    }

    if (data.organization !== undefined && Array.isArray(data.organization) && data.organization.length > 0) {
        conditions.push(`organization IN (${data.organization.map(item => sqlstring.escape(item)).join(', ')})`);
    } else {
        conditions.push(`organization = ${sqlstring.escape(organization)}`);
    }

    if (data.priceType === 'total') {
        if (data.priceFrom !== undefined && data.priceTo !== undefined) {
            conditions.push(`cost * area BETWEEN ${sqlstring.escape(data.priceFrom)} AND ${sqlstring.escape(data.priceTo)}`);
        } else if (data.priceFrom !== undefined) {
            conditions.push(`cost * area >= ${sqlstring.escape(data.priceFrom)}`);
        } else if (data.priceTo !== undefined) {
            conditions.push(`cost * area <= ${sqlstring.escape(data.priceTo)}`);
        }
    } else {
        if (data.priceFrom !== undefined && data.priceTo !== undefined) {
            conditions.push(`cost BETWEEN ${sqlstring.escape(data.priceFrom)} AND ${sqlstring.escape(data.priceTo)}`);
        } else if (data.priceFrom !== undefined) {
            conditions.push(`cost >= ${sqlstring.escape(data.priceFrom)}`);
        } else if (data.priceTo !== undefined) {
            conditions.push(`cost <= ${sqlstring.escape(data.priceTo)}`);
        }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
        SELECT id, room, type, liter, id_liter, cost, area, floor, ceiling, promotion, promotion_price
        FROM rooms 
        ${whereClause}
        ORDER BY promotion DESC, cost ${data.priceDesc ? 'DESC' : ''}, id
        LIMIT ${data.limit}
        OFFSET ${data.offset}
        FORMAT JSON`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios({
            ...dbOptions,
            url: `/?${queryParams}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getReport(base) {
    const sanitizedBase = base.map(item => sqlstring.escape(item)).join(', ');
    const query = `
        SELECT 
            type,
            COUNT(*) as total,
            SUM(CASE WHEN status = 'В аренде' THEN 1 ELSE 0 END) as rented,
            ROUND(100.0 * SUM(CASE WHEN status = 'В аренде' THEN 1 ELSE 0 END) / COUNT(*), 2) as rented_percentage,
            ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM rooms), 2) as type_percentage
        FROM 
            rooms
        WHERE
            organization IN (${sanitizedBase})
        GROUP BY 
            type
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

async function getRoomById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT id, room, type, liter, id_liter, key_liter, key_liter_id, cost, area, floor, ceiling, text, promotion, complex_id, kode_text
        FROM rooms
        WHERE id = ${sanitizedId}
        LIMIT 1
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

async function getRoomsByParam(params) {
    const conditions = Object.keys(params)
        .map(key => `${sqlstring.escapeId(key)} = ${sqlstring.escape(params[key])}`)
        .join(' AND ');

    const query = `
        SELECT id, kode_text AS code, complex_id AS complex
        FROM rooms
        WHERE ${conditions} AND kode_text != '' AND organization = ${sqlstring.escape(organization)}
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

async function getRecommended(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT id, room, type, liter, id_liter, cost, area, floor, ceiling, promotion
        FROM rooms
        JOIN (
            SELECT type, cost, area
            FROM rooms
            WHERE id = ${sanitizedId}
        ) AS subquery
        ON rooms.type = subquery.type
        WHERE rooms.id != ${sanitizedId} AND organization = ${sqlstring.escape(organization)}
        ORDER BY ABS(rooms.cost - subquery.cost), ABS(rooms.area - subquery.area)
        LIMIT 3
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

async function alterRoomById(id, data) {
    const updates = Object.keys(data).map(key => `${sqlstring.escapeId(key)} = ${sqlstring.escape(data[key])}`).join(', ');
    const query = `ALTER TABLE rooms UPDATE ${updates} WHERE id = ${sqlstring.escape(id)}`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        await axios.post(`/?${queryParams}`, null, dbOptions);
        return { success: true };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAll,
    getReport,
    getPage,
    getTypes,
    getIdLiter,
    getRoomById,
    getRecommended,
    getRoomsByTenant,
    getRoomsByParam,
    alterRoomById,
};