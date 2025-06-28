const { Op } = require("sequelize");
const globalError = require("../../../../../../../errors/global.error");
const CustomerShippingAddress = require("../../../../../../../models/company.models/customer.models/customer_shipping_address.model");

const getCustomerShippingAddressByCustomerId = async (req, res, next) => {
  try {
    const { customer_id } = req.body;

    if (!customer_id) {
      return next(globalError(200, "Address not found"));
    }

    const condition = {
      [Op.and]: [{ deleted: false }, { status: true }, { customer_id }],
    };
    const address = await CustomerShippingAddress.findAll({
      where: { ...condition },
      attributes: [
        "shipping_address_id",
        "contact_person",
        "contact_phone",
        "address",
        "city",
        "zip_code",
        "state",
        "country",
        "status",
        "state_code",
        "createdAt",
      ],
    });
    return res.status(200).json({ success: true, data: address });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

module.exports = { getCustomerShippingAddressByCustomerId };
