const globalError = require("../../../../../../errors/global.error");
const MaterialGrade = require("../../../../../../models/company.models/product.models/material_grade.model");
const { toUpperCase, trimSpace } = require("../../../../../../utils/helpers/text_checker");

const newMaterialGradeRegistration = async (req, res, next) => {
    try {
        const { number, status = true } = req.body
        const value = {
            status,
            number: toUpperCase(trimSpace(number)),
            added_by: req.jwtTokenDecryptData.authority[0],
            added_by_id: req.jwtTokenDecryptData.user["user_id"],
        }
        const materialGrade = await MaterialGrade.create(value);
        if (!materialGrade) {
            return next(globalError(500, 'Something went wrong'))
        }
        return res.status(201).json({ success: true, message: `Material grade successfully created` })
    } catch (error) {
        if (error?.errors.length > 0) {
            return next(globalError(409, error.errors[0].message))
        }
        return next(globalError(500, 'Internal server error'))
    }
}

module.exports = { newMaterialGradeRegistration }