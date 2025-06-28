const globalError = require("../../../../../errors/global.error");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");

const deleteCustomer = async (req, res, next) => {
  try {
    const { customer_id } = req.body;
    const value = {
      deleted: true,
    };
    const customer = await Customer.update(value, {
      where: {
        customer_id: customer_id,
      },
    });
    if (customer[0] === 0) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Customer Deleted Successfully" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { deleteCustomer };
