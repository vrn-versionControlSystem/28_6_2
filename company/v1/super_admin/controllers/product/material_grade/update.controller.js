const globalError = require("../../../../../../errors/global.error");
const MaterialGrade = require("../../../../../../models/company.models/product.models/material_grade.model");


const updateMaterialGradeDetailsByMaterialGradeId = async (req, res, next) => {
    try {
        const { status = false, number, material_grade_id } = req.body
        const value = {
            status,
            number
        }
        const material = await MaterialGrade.update(value, {
            where: {
                material_grade_id
            }
        });
        if (material[0] === 0) {
            return next(globalError(404, 'Material not found'))
        }
        return res.status(200).json({ success: true, message: 'Material successfully updated' })
    } catch (error) {
        return next(globalError(500, error.message))
    }
}




const deleteMaterialGradeByMaterialGradeId = async (req, res, next) => {
    try {
        const { material_grade_id } = req.body
        const value = {
            deleted: true,
        }
        const material = await MaterialGrade.update(value, {
            where: {
                material_grade_id
            }
        });
        if (material[0] === 0) {
            return next(globalError(404, 'Material not found'))
        }
        return res.status(200).json({ success: true, message: 'Material successfully deleted' })
    } catch (error) {
        return next(globalError(500, error.message))
    }
}





module.exports = { updateMaterialGradeDetailsByMaterialGradeId, deleteMaterialGradeByMaterialGradeId }

