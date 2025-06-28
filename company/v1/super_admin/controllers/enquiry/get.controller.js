const { Op } = require("sequelize");
const Enquiry = require("../../../../../models/company.models/enquiry.models/enquiryMaster");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");
const EnquiryList = require("../../../../../models/company.models/enquiry.models/enquiryDetails.model");
const globalError = require("../../../../../errors/global.error");
const Product = require("../../../../../models/company.models/product.models/product.model");
const Drawing = require("../../../../../models/company.models/product.models/drawing.model");
const { sequelize } = require("../../../../../configs/database");

const getAllEnquiry = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };
    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          {
            poc_name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            enquiry_number: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      });
    }

    const enquiry = await Enquiry.findAndCountAll({
      where: { ...condition },
      attributes: [
        "enquiry_id",
        "enq_number",
        "customer_id",
        "enquiry_date",
        "enquiry_type",
        "poc_name",
        "poc_contact",
      ],
      include: [
        {
          model: Customer,
          attributes: ["name"],
        },
      ],
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
    });

    if (enquiry.count === 0) {
      return res.status(200).json({ success: true, total: 0, data: [] });
    }

    return res
      .status(200)
      .json({ success: true, total: enquiry.count, data: enquiry.rows });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getEnquiryById = async (req, res, next) => {
  try {
    const { enquiry_id } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { enquiry_id: enquiry_id }],
    };

    // const enquiry = await EnquiryList.findOne({
    //   where: {
    //     enquiry_id,
    //   },
    //   include: [
    //     {
    //       model: Product,
    //     },
    //   ],
    // });

    const enquiry = await Enquiry.findOne({
      where: { ...condition },
      attributes: [
        "enquiry_id",
        "enq_number",
        "customer_id",
        "enquiry_date",
        "enquiry_type",
        "poc_name",
        "poc_contact",
      ],
      include: [
        {
          model: EnquiryList,
          attributes: [
            "enquiry_id",
            "enquiry_list_id",
            "quantity",
            "delivery_date",
          ],
          include: [
            {
              model: Product,
              attributes: [
                "product_id",
                "drawing_number",
                "name",
                "item_code",
                "row_code",
                "pump_model",
                "product_code",
                "unit_measurement",
                "standard_lead_time",
                "standard_lead_time_type",
              ],
            },
          ],
        },
      ],
    });

    const productIds = enquiry.EnquiryLists.map(
      (item) => item.Product.product_id
    );

    let data = enquiry.toJSON();

    const drawings = await Drawing.findAll({
      where: {
        product_id: productIds,
        deleted: false,
      },
      attributes: ["drawing_id", "revision_number"],
    });

    data = {
      ...data,
      EnquiryLists: [],
      items: data?.EnquiryLists.map((lt, index) => {
        return {
          ...lt,

          Product: {
            ...lt.Product,
            Drawings: [drawings[index]],
          },
          drawing_revision: drawings[index].revision_number,
        };
      }),
    };
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = { getAllEnquiry, getEnquiryById };
