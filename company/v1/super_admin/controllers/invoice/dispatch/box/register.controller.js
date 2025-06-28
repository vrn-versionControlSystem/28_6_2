const globalError = require("../../../../../../../errors/global.error");
const DispatchBox = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_box_list");

const newDispatchBoxRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    const { DispatchBoxList = [] } = req.body;
    const value = DispatchBoxList.map((box, index) => {
      const {
        box_length,
        box_height,
        box_breadth,
        box_size_type,
        tare_weight,
        box_no,
      } = box;
      return {
        dispatch_invoice_id: req.dispatchInvoice.dispatch_invoice_id,
        box_no: Number(box_no),
        box_length,
        box_height,
        box_breadth,
        box_size_type,
        tare_weight,
      };
    });
    const newDispatchBox = await DispatchBox.bulkCreate(value, {
      returning: true,
      transaction: t,
    });
    if (newDispatchBox.length === 0) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.dispatchBox = newDispatchBox;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

const newDispatchBoxRegistrationInvoiceEdit = async (req, res, next) => {
  try {
    const {
      box_length,
      box_height,
      box_breadth,
      box_size_type,
      tare_weight,
      dispatch_invoice_id,
      box_no,
    } = req.body;
    const value = {
      dispatch_invoice_id: dispatch_invoice_id,
      box_no,
      box_length,
      box_height,
      box_breadth,
      box_size_type,
      tare_weight,
    };

    const newDispatchBox = await DispatchBox.create(value, { returning: true });
    if (newDispatchBox.length === 0) {
      return next(globalError(500, "Box Not Added"));
    }

    return res.status(200).json({
      success: true,
      message: "Box Added Successfully",
      data: newDispatchBox.toJSON(),
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  newDispatchBoxRegistration,
  newDispatchBoxRegistrationInvoiceEdit,
};
