const { sequelize } = require("../../../../../../configs/database");
const globalError = require("../../../../../../errors/global.error");
const PoList = require("../../../../../../models/company.models/po_and_poList.models/po_list.model");

const updatePoListByPoListId = async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
        const { list_status = 'rejected', po_list_id, accept_delivery_date, accept_description } = req.body
        const value = {
            list_status,
            accept_delivery_date,
            accept_description
        }
        const updatedPoList = await PoList.update(value, {
            where: { po_list_id },
            transaction: t
        });
        if (updatedPoList[0] === 0) {
            await t.rollback()
            return next(globalError(404, 'PO list not found'))
        }
        req.t = t
        return next()
    } catch (error) {
        await t.rollback()
        return next(globalError(500, 'Internal server error'))
    }
}

module.exports = { updatePoListByPoListId }