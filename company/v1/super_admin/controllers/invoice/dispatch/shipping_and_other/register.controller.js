const globalError = require("../../../../../../../errors/global.error");
const DispatchShippingAndOtherDetails = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_other_details");

const newDispatchShippingAndOtherDetailsRegistration = async (
  req,
  res,
  next
) => {
  const t = req.t;
  try {
    console.log("ji----", req.body);

    console.log("10");
    const {
      end_use_code = "",
      packing_details = "",
      excise_document = "",
      freight = "",
      shipping_term = "",
      payment_term = "",
      shipping_line = "",
      shipping_insurance = "",
      vehicle_no = "",
      bill_type = "NON GST",
      c_gst,
      s_gst,
      i_gst,
      e_way_bill_no = "",
      remark = "",
      convert_rate = 0,
      packing_charges = 0,
      fright_charges = 0,
      other_charges = 0,
    } = req.body.DispatchShippingAndOtherDetails;

    console.log("other_charges", other_charges);
    const value = {
      dispatch_invoice_id: req.dispatchInvoice
        ? req.dispatchInvoice.dispatch_invoice_id
        : null,
      pattern_invoice_id: req.newPatternInvoice
        ? req.newPatternInvoice.pattern_invoice_id
        : null,
      end_use_code,
      packing_details,
      excise_document,
      freight,
      shipping_term,
      payment_term,
      shipping_line: shipping_line ? shipping_line : "123",
      shipping_insurance,
      vehicle_no,
      bill_type,
      c_gst: c_gst ? c_gst : 0,
      s_gst: s_gst ? s_gst : 0,
      i_gst: i_gst ? i_gst : 0,
      e_way_bill_no,
      remark,
      convert_rate: convert_rate ? convert_rate : 0,
      packing_charges: parseFloat(packing_charges),
      fright_charges: parseFloat(fright_charges),
      other_charges: parseFloat(other_charges),
    };

    const newPermanentAddress = await DispatchShippingAndOtherDetails.create(
      value,
      {
        transaction: t,
      }
    );
    if (!newPermanentAddress) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }

    console.log("ji");
    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Invoice successfully created",
      invoice_no: req.dispatchInvoice?.invoice_no,
    });
  } catch (error) {
    await t.rollback();
    console.log("Error", error);
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchShippingAndOtherDetailsRegistration };
