const { Op } = require("sequelize");
const Po = require("../../../../../models/company.models/po_and_poList.models/po.model");
const PoList = require("../../../../../models/company.models/po_and_poList.models/po_list.model");
const Product = require("../../../../../models/company.models/product.models/product.model");
const globalError = require("../../../../../errors/global.error");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");
const Drawing = require("../../../../../models/company.models/product.models/drawing.model");

const getAllPoWithPagination = async (req, res, next) => {
    try {
        const { pageIndex = 1, pageSize = 10, query = '' } = req.body
        const condition = {
            [Op.and]: [
                { deleted: false },
                { status: 'processing' }
            ],
        };

        if (query) {
            condition[Op.and].push({
                [Op.or]: [
                    {
                        number: {
                            [Op.like]: `%${query}%`,
                        },
                    }
                ],
            })
        }

        const po = await Po.findAndCountAll({
            where: { ...condition },
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            distinct: true,
            order: [['createdAt', 'DESC']],
            attributes: ['po_id', 'poa', 'number', 'status', 'currency_type', 'date', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: Customer,
                    attributes: [
                        "customer_id",
                        "customer_code",
                        "vender_code",
                        "name",
                        "status",
                        "mobile",
                        "phone",
                        "email",
                        "pan",
                        "gst_no",
                        "type",
                        "createdAt"]
                },
            ]
        });
        return res.status(200).json({ success: true, total: po.count, data: po.rows })
    } catch (error) {
        next(globalError(500, error.message))
    }
}



const getPoDetailsByPoId = async (req, res, next) => {
    try {
        const { po_id } = req.body
        const condition = {
            [Op.and]: [
                { deleted: false },
                { status: 'processing' },
            ],
        };

        const po = await Po.findByPk(po_id, {
            where: { ...condition },
            attributes: ['po_id', 'poa', 'status', 'number', 'currency_type', 'date', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: PoList,
                    where: { list_status: 'accepted' },
                    attributes: ['po_list_id', 'serial_number', 'project_no', 'quantity', 'delivery_date', 'description', 'accept_description', 'accept_delivery_date', 'list_status'],
                    include: [
                        {
                            model: Product,
                            attributes: ['product_id', 'name', 'item_code', 'product_code', 'unit_measurement', 'standard_lead_time', 'standard_lead_time_type', 'drawing_number'],
                        },
                        {
                            model: Drawing,
                            attributes: ['drawing_id', 'revision_number']
                        }
                    ]
                },
                {
                    model: Customer,
                    attributes: ["customer_id",
                        "customer_code",
                        "vender_code",
                        "name",
                        "status",
                        "mobile",
                        "phone",
                        "email",
                        "pan",
                        "gst_no",
                        "type",
                        "createdAt"]
                },
            ]
        });

        if (!po) {
            return next(globalError(200, 'Po not found'))
        }
        return res.status(200).json({ success: true, data: po.toJSON() })
    } catch (error) {
        next(globalError(500, error.message))
    }
}


module.exports = { getAllPoWithPagination, getPoDetailsByPoId }