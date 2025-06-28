const globalError = require("../../../../errors/global.error");
const ShippingInsurance = require("../../../../models/company.models/shipping_insurance.model");
const { toUpperCase, trimSpace } = require("../../../../utils/helpers/text_checker");

const isShippingInsuranceExist = async (req, res, next) => {
    try {
        const company_id = req.jwtTokenDecryptData.user["company_id"]
        const { name } = req.body
        const existingShippingInsurance = await ShippingInsurance.findOne({
            where: {
                name: toUpperCase(trimSpace(name)),
                company_id,
                deleted: false
            },
        });
        if (existingShippingInsurance) {
           return next(globalError(406, "Shipping Insurance is already exists"))
        }
        return next()
    } catch (error) {
        return next(globalError(500, 'Internal server error'))
    }
}


module.exports = isShippingInsuranceExist