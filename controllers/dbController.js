const pick = require('lodash/pick');
const tenantService = require('../services/tenantService');
const roomsService = require('../services/roomsService');
const ticketService = require('../services/ticketService');
const docsService = require('../services/docsService');

// Tenants

async function getTenantByParam(params) {
    try {
        const user = await tenantService.getTenantByParam(params);
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        console.log(error);
    }
}

async function getTenantTgUsername(req, res, next) {
    try {
        const id = req.user.id;
        const user = await tenantService.getTenantByParam({ id });
        const username = user && user.data?.length > 0 ? user.data[0].tg_user : '';
        const tg_id = user && user.data?.length > 0 ? parseInt(user.data[0].tg_id) : 0;
        res.json({ username, tg_id });
    } catch (error) {
        next(error);
    }
}

async function setTenantEmail(id, email) {
    try {
        const user = await tenantService.alterTenantById(id, { email });
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        console.log(error);
    }
}

async function setTenantPassword(id, password) {
    try {
        const user = await tenantService.alterTenantById(id, { password });
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        console.log(error);
    }
}

async function setTenantTgId(id, tg_id) {
    try {
        const user = await tenantService.alterTenantById(id, { tg_id });
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        console.log(error);
    }
}

async function setTenantTgUsername(req, res, next) {
    try {
        const id = req.user.id;
        const { tg_user } = pick(req.body, ['tg_user']);
        const user = await tenantService.alterTenantById(id, { tg_user });
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        next(error);
    }
}

// Rooms

async function getAllRooms(req, res, next) {
    try {
        const rooms = await roomsService.getAll();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsByTenant(req, res, next) {
    try {
        const rooms = await roomsService.getRoomsByTenant(req.user.id);
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsSearch(req, res, next) {
    try {
        const data = pick(req.body, ['startIdx', 'endIdx', 'type', 'building', 'areaFrom', 'areaTo', 'priceFrom', 'priceTo', 'priceType', 'priceDesc', 'storey', 'rooms', 'ceilingHeight', 'promotions', 'organization']);
        const dbData = {};

        if (data.startIdx !== undefined && data.startIdx !== null) dbData.offset = data.startIdx || 0;
        if (data.endIdx !== undefined && data.endIdx !== null) dbData.limit = (data.endIdx - dbData.offset) || 6;

        if (data.type && data.type !== '') dbData.type = data.type;
        if (data.building && data.building !== '') dbData.id_liter = data.building;
        if (data.areaFrom && data.areaFrom !== '') dbData.areaFrom = parseFloat(data.areaFrom);
        if (data.areaTo && data.areaTo !== '') dbData.areaTo = parseFloat(data.areaTo);
        if (data.priceFrom && data.priceFrom !== '') dbData.priceFrom = parseFloat(data.priceFrom);
        if (data.priceTo && data.priceTo !== '') dbData.priceTo = parseFloat(data.priceTo);
        if (data.priceType && data.priceType !== '') dbData.priceType = data.priceType;
        if (data.priceDesc !== undefined) dbData.priceDesc = data.priceDesc;
        if (data.storey && data.storey !== '') dbData.floor = parseFloat(data.storey);
        if (data.rooms && data.rooms !== '') dbData.roomsAmount = data.rooms;
        if (data.ceilingHeight && data.ceilingHeight !== '') dbData.ceiling = parseFloat(data.ceilingHeight);
        if (data.promotions !== undefined) dbData.promotion = data.promotions;
        if (data.organization && data.organization !== '') dbData.organization = data.organization;

        const rooms = await roomsService.getPage(dbData);
        res.json({ rows: rooms.data, total: rooms.rows_before_limit_at_least });
    } catch (error) {
        next(error);
    }
}

async function getRoomsTypes(req, res, next) {
    try {
        const rooms = await roomsService.getTypes();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsLiters(req, res, next) {
    try {
        const rooms = await roomsService.getIdLiter();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsReport(req, res, next) {
    try {
        const base = req.params.base;
        let baseArr = [];
        if (base == 'depot') {
            baseArr.push('ДЕПО АО');
        } else if (base == 'gagarinsky') {
            baseArr.push('ГАГАРИНСКИЙ ПКЦ ООО');
        } else if (base == 'yujnaya') {
            baseArr.push('База Южная ООО');
            baseArr.push('Строительная База "Южная" ООО');
        }
        const rooms = await roomsService.getReport(baseArr);
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsReportMiddleware(req, res, next) {
    try {
        const base = req.params.base;
        let baseArr = [];
        if (base == 'depot') {
            baseArr.push('ДЕПО АО');
        } else if (base == 'gagarinsky') {
            baseArr.push('ГАГАРИНСКИЙ ПКЦ ООО');
        } else if (base == 'yujnaya') {
            baseArr.push('База Южная ООО');
            baseArr.push('Строительная База "Южная" ООО');
        }
        const rooms = await roomsService.getReport(baseArr);
        req.rooms = rooms.data;
        next();
    } catch (error) {
        next(error);
    }
}

async function getRoomsById(req, res, next) {
    try {
        const id = req.params.id;
        const rooms = await roomsService.getRoomById(id);
        res.json(rooms.data[0]);
    } catch (error) {
        next(error);
    }
}

async function getRoomsByBuilding(req, res, next) {
    try {
        const id = req.params.id;
        const rooms = await roomsService.getRoomsByParam({ key_liter_id: id});
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsByComplex(req, res, next) {
    try {
        const id = req.params.id;
        const rooms = await roomsService.getRoomsByParam({ complex_id: id });
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsRecommended(req, res, next) {
    try {
        const id = req.params.id;
        const rooms = await roomsService.getRecommended(id);
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function setRoomsPromotions(req, res, next) {
    try {
        const { id, promotion, price } = pick(req.body, ['id', 'promotion', 'price']);
        const rooms = await roomsService.alterRoomById(id, { promotion, promotion_price: price });
        res.json({ success: rooms.success });
    } catch (error) {
        next(error);
    }
}

// Tickets

async function getTicketByIdBot(id) {
    try {
        const ticket = await ticketService.getTicketById(id);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketByNumberBot(number) {
    try {
        const ticket = await ticketService.getTicketByNumber(number);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketsByUserBot(id, offset, limit) {
    try {
        const ticket = await ticketService.getTicketByUserTg(id, offset, limit);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketsByStatusBot(status, offset, limit) {
    try {
        const ticket = await ticketService.getTicketByStatusTg(status, offset, limit);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function insertTicketBot(data) {
    try {
        const ticket = await ticketService.insertTicket(data);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function updateTicketStatusBot(data) {
    try {
        const ticket = await ticketService.updateTicketStatus(data);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketsByTenant(req, res, next) {
    try {
        const ticket = await ticketService.getTicketsByTenant(req.user.id);
        res.json(ticket.data);
    } catch (error) {
        next(error);
    }
}

async function insertTicketFromBackoffice(req, res, next) {
    try {
        const userId = req.user.id;
        const { text } = pick(req.body, ['text']);
        const ticket = await ticketService.insertTicketBackoffice({ userId, text });
        res.json(ticket.data);
    } catch (error) {
        next(error);
    }
}

// Docs

async function getDocsByUser(req, res, next) {
    try {
        const docs = await docsService.getDocsByTenant(req.user.id);
        res.json(docs.data);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTenantByParam,
    setTenantEmail,
    getTenantTgUsername,
    setTenantPassword,
    setTenantTgUsername,
    setTenantTgId,
    getAllRooms,
    getRoomsSearch,
    getRoomsTypes,
    getRoomsLiters,
    getRoomsReport,
    getRoomsReportMiddleware,
    getRoomsById,
    getRoomsByBuilding,
    getRoomsByComplex,
    getRoomsRecommended,
    getRoomsByTenant,
    setRoomsPromotions,
    getTicketByIdBot,
    getTicketByNumberBot,
    getTicketsByTenant,
    insertTicketBot,
    getTicketsByUserBot,
    getTicketsByStatusBot,
    updateTicketStatusBot,
    insertTicketFromBackoffice,
    getDocsByUser,
};
