const globalError = require("../../../../../../errors/global.error");
const PoList = require("../../../../../../models/company.models/po_and_poList.models/po_list.model");

const getAllPoListByPoId = async (req, res, next) => {
    try {
        const { list_status = 'reject'} = req.body
        const allPoList = await PoList.findAll({
            where: { po_id }
        });

        if (allPoList[0] === 0) {
            return next(globalError(404, 'PO list not found'))
        }

        if (list_status === 'reject') {
            return res.status(200).json({ success: true, message: 'List successfully rejected' })
        }
        return res.status(200).json({ success: true, message: 'List successfully accepted' })
    } catch (error) {
        return next(globalError(500, 'Internal server error'))
    }
}

module.exports = { getAllPoListByPoId }