const { Op } = require("sequelize");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");
const CustomerPermanentAddress = require("../../../../../models/company.models/customer.models/customer_permanent_address.model");
const globalError = require("../../../../../errors/global.error");
const CustomerShippingAddress = require("../../../../../models/company.models/customer.models/customer_shipping_address.model");
const CustomerShippingDetails = require("../../../../../models/company.models/customer.models/customer_shipping_details");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");
const getAllCustomersWithPagination = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "", type = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    if (type) {
      condition[Op.and].push({ type: type });
    }

    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          {
            name: {
              [Op.eq]: trimSpace(query),
            },
          },
          {
            customer_code: {
              [Op.eq]: trimSpace(query),
            },
          },
          { "$Customer.name$": { [Op.like]: `%${query}%` } },
        ],
      });
    }

    const customers = await Customer.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["name", "ASC"]], // Order by name in alphabetical order
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
        "createdAt",
      ],
    });

    if (customers.rows.length === 0) {
      return next(globalError(200, "Customer not found"));
    }

    return res
      .status(200)
      .json({ success: true, total: customers.count, data: customers.rows });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }, , { status: true }],
    };
    const customers = await Customer.findAll({
      where: { ...condition },
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
        "createdAt",
      ],
      include: [
        {
          model: CustomerPermanentAddress,
          attributes: [
            "address_id",
            "address",
            "city",
            "zip_code",
            "state",
            "country",
            "state_code",
          ],
        },
      ],
    });
    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getCustomerDetailsByCustomerId = async (req, res, next) => {
  try {
    const { customer_id } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { customer_id }],
    };
    const customers = await Customer.findOne({
      where: { ...condition },
      distinct: true,
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
        "createdAt",
      ],
      include: [
        {
          model: CustomerPermanentAddress,
          attributes: [
            "address_id",
            "address",
            "city",
            "zip_code",
            "state",
            "country",
          ],
        },
        {
          model: CustomerShippingAddress,
          required: false,
          where: { deleted: false },
          attributes: [
            "shipping_address_id",
            "contact_person",
            "contact_phone",
            "address",
            "city",
            "zip_code",
            "state",
            "state_code",
            "country",
          ],
        },
        {
          model: CustomerShippingDetails,
          required: false,
          where: { deleted: false },
          attributes: [
            "shipping_details_id",
            "pre_carriage_by",
            "place_of_receipt",
            "port_of_discharge",
            "country_of_goods",
            "destination",
            "port_of_loading",
            "final_destination",
          ],
        },
      ],
    });
    if (!customers) {
      return globalError(200, "Customer not found");
    }
    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getAllCustomersOption = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }, { status: true }],
    };
    const customers = await Customer.findAll({
      where: { ...condition },
      attributes: ["customer_id", "name"],
    });

    const data = customers.map((obj) => {
      return { label: obj.name, value: obj.customer_id };
    });
    return res
      .status(200)
      .json({ success: true, data: [{ label: "ALL", value: "" }, ...data] });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getAllCustomersWithPagination,
  getAllCustomers,
  getCustomerDetailsByCustomerId,
  getAllCustomersOption,
};
