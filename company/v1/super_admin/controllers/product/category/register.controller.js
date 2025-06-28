const globalError = require("../../../../../../errors/global.error");
const Category = require("../../../../../../models/company.models/product.models/category.model");
const { toUpperCase, trimSpace } = require("../../../../../../utils/helpers/text_checker");



const newCategoryRegistration = async (req, res, next) => {
    try {
        const { name, status = true } = req.body
        const value = {
            status,
            name: toUpperCase(trimSpace(name)),
            added_by: req.jwtTokenDecryptData.authority[0],
            added_by_id: req.jwtTokenDecryptData.user["user_id"],
        }
        const category = await Category.create(value);
        if (!category) {
            return next(globalError(500, 'Something went wrong'))
        }
        return res.status(201).json({ success: true, message: `Category successfully created` })
    } catch (error) {
        if (error?.errors.length > 0) {
            return next(globalError(409, error.errors[0].message))
        }
        return next(globalError(500, 'Internal server error'))
    }
}

module.exports = { newCategoryRegistration }