const globalError = require("../../../../../../errors/global.error");
const DispatchInvoice = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");

const updateDispatchById = async (req, res, next) => {
  try {
    const { bl = "", coo = "", cefa = "", dispatch_invoice_id } = req.body;
    const value = {
      bl,
      coo,
      cefa,
    };
    const updatedDispatch = await DispatchInvoice.update(value, {
      where: { dispatch_invoice_id },
    });
    if (updatedDispatch[0] === 0) {
      return next(globalError(404, "Dispatch not found"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Dispatch successfully updated" });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

const updateDispatchInvoiceDate = async (req, res, next) => {
  try {
    const { invoice_date, dispatch_invoice_id } = req.body;
    const value = {
      invoice_date,
    };
    const updatedDispatch = await DispatchInvoice.update(value, {
      where: { dispatch_invoice_id },
    });
    if (updatedDispatch[0] === 0) {
      return next(globalError(404, "Dispatch not found"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Dispatch successfully updated" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const updateDispatchInvoiceStatus = async (req, res, next) => {
  try {
    const { dispatch_invoice_id, status } = req.body;

    if (!dispatch_invoice_id || !status) {
      return next(
        globalError(400, "dispatch_invoice_id and status are required")
      );
    }

    console.log("Received dispatch_invoice_id:", dispatch_invoice_id);
    console.log("Received status:", status);

    const updateResult = await DispatchInvoice.update(
      { status },
      {
        where: {
          dispatch_invoice_id,
        },
      }
    );

    console.log("Update Result:", updateResult);

    if (updateResult[0] === 0) {
      return next(globalError(500, "Failed to update status"));
    }

    return res.status(200).json({
      success: true,
      message: "Status successfully updated",
    });
  } catch (error) {
    console.log("Error:", error);
    return next(globalError(500, error.message));
  }
};

module.exports = {
  updateDispatchById,
  updateDispatchInvoiceDate,
  updateDispatchInvoiceStatus,
};
