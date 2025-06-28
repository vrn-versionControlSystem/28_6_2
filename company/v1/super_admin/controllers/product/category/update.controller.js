const globalError = require("../../../../../../errors/global.error");
const Category = require("../../../../../../models/company.models/product.models/category.model");

const updateCategoryDetailsByCategoryId = async (req, res, next) => {
    try {
        const { status = false, name, category_id } = req.body
        const value = {
            status,
            name
        }
        const category = await Category.update(value, {
            where: {
                category_id
            }
        });
        if (category[0] === 0) {
            return next(globalError(404, 'Category not found'))
        }
        return res.status(200).json({ success: true, message: 'Category successfully updated' })
    } catch (error) {
        return next(globalError(500, 'Internal server error'))
    }
}




const deleteCategoryByCategoryId = async (req, res, next) => {
    try {
        const { category_id } = req.body
        const value = {
            deleted: true,
        }
        const category = await Category.update(value, {
            where: {
                category_id
            }
        });
        if (category[0] === 0) {
            return next(globalError(404, 'Category not found'))
        }
        return res.status(200).json({ success: true, message: 'Category successfully deleted' })
    } catch (error) {
        return next(globalError(500, 'Internal server error'))
    }
}





module.exports = { updateCategoryDetailsByCategoryId, deleteCategoryByCategoryId }
