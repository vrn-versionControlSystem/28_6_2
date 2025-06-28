const globalError = require("../../../../../../../errors/global.error")
const { toUpperCaseOrNull, trimSpace } = require("../../../../../../../utils/helpers/text_checker")
const DispatchLocation = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_location")

const newDispatchLocationRegistration = async (req, res, next) => {
    const t = req.t
    try {
        const {
            DispatchList = []
        } = req.body


        const value = DispatchList.map((item) => {
            const {
                location_code
            } = item
            return {
                dispatch_invoice_id: req.dispatchInvoice.dispatch_invoice_id,
                location_code: toUpperCaseOrNull(trimSpace(location_code))
            }
        })
        const newDispatchLocation = await DispatchLocation.bulkCreate(value, { returning: true, transaction: t });
        if (newDispatchLocation.length === 0) {
            await t.rollback()
            return next(globalError(500, 'Something went wrong'))
        }
        req.dispatchLocation = newDispatchLocation.map((location) => location.toJSON())
        return next()
    } catch (error) {
        await t.rollback()
        return next(globalError(500, error.message))
    }
}

module.exports = { newDispatchLocationRegistration }