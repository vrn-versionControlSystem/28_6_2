const { Op } = require("sequelize");
const CustomerShippingDetails = require("../../../../../../../models/company.models/customer.models/customer_shipping_details");
const globalError = require("../../../../../../../errors/global.error");

const getCustomerShippingDetailsByCustomerId = async (req, res, next) => {
  try {
    const { customer_id } = req.body;

    if (!customer_id) {
      return next(globalError(200, "Shipping details not found"));
    }

    const condition = {
      [Op.and]: [
        { deleted: false },
        { status: true },
        { customer_id: customer_id },
      ],
    };
    const shippingAddress = await CustomerShippingDetails.findAll({
      where: { ...condition },
      // attributes: [
      //     "customer_id",
      //     "customer_code",
      //     "vender_code",
      //     "customer_name",
      //     "customer_status",
      //     "customer_mobile",
      //     "customer_phone",
      //     "customer_email",
      //     "customer_pan",
      //     "customer_gst_no",
      //     "customer_type",
      //     "createdAt"
      // ]
    });
    return res.status(200).json({ success: true, data: shippingAddress });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

module.exports = { getCustomerShippingDetailsByCustomerId };
