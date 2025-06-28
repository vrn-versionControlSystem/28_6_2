const globalError = require("../../../../../../../errors/global.error");
const CustomerShippingDetails = require("../../../../../../../models/company.models/customer.models/customer_shipping_details");

const customerNewShippingDetailsRegistration = async (req, res, next) => {
    try {
        const { pre_carriage_by, place_of_receipt, port_of_discharge, country_of_goods, destination, port_of_loading, final_destination, customer_id } = req.body;
        const value = {
            customer_id,
            pre_carriage_by,
            place_of_receipt,
            port_of_discharge,
            country_of_goods,
            destination,
            port_of_loading,
            final_destination,
            added_by: req.jwtTokenDecryptData.authority[0],
            added_by_id: req.jwtTokenDecryptData.user["user_id"],
        }
        const newShipping = await CustomerShippingDetails.create(value, { returning: true });
        if (!newShipping) {
            return next(globalError(500, 'Something went wrong'))
        }
        return res.status(201).json({
            success: true,
            data: newShipping,
            message: `Shipping details successfully created`
        });
    } catch (error) {
        return next(globalError(500, 'Internal server error'));
    }
};

module.exports = { customerNewShippingDetailsRegistration };
