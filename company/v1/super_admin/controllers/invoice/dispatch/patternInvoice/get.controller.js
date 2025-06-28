const { Op } = require("sequelize");
const globalError = require("../../../../../../../errors/global.error");
const DispatchInvoice = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const PatternInvoice = require("../../../../../../../models/company.models/invoice.models/pattern_invoice.models/pattern_invoice");
const PatternInvoiceList = require("../../../../../../../models/company.models/invoice.models/pattern_invoice.models/pattern_invoice_list");
const DispatchConsignee = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_consignee");
const DispatchConsigneeAddress = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_consignee_address");
const DispatchBuyer = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_buyer");
const DispatchShippingAddress = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_address");
const DispatchBoxList = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_box_list");
const DispatchLocation = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_location");
const DispatchList = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const DispatchNote = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_note");
const DispatchBankDetails = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_bank_details");
const DispatchShippingDetails = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_details");
const DispatchCompanyDetails = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_company_details");
const DispatchShippingAndOtherDetails = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_other_details");
const Po = require("../../../../../../../models/company.models/po_and_poList.models/po.model");
const PoList = require("../../../../../../../models/company.models/po_and_poList.models/po_list.model");

const getAllPatternInvoiceWithPagination = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      query = "",
      type = "",
      customer_id = "",
    } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };
    const customerCondition = {
      [Op.and]: [],
    };
    if (type) {
      condition[Op.and].push({ invoice_type: type });
    }

    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          {
            invoice_no: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      });
    }

    if (customer_id && JSON.parse(customer_id).length > 0) {
      const customerIds = JSON.parse(customer_id);
      if (Array.isArray(customerIds)) {
        customerCondition[Op.and].push({
          customer_id: { [Op.in]: customerIds },
        });
      }
    }

    const dispatchInvoice = await PatternInvoice.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      offset: (pageIndex - 1) * pageSize,
      include: [
        {
          model: DispatchConsignee,
          where: { ...customerCondition },
          required: true,
          attributes: [
            "dispatch_consignee_id",
            "customer_id",
            "vender_code",
            "customer_code",
            "name",
            "mobile",
          ],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      total: dispatchInvoice.count,
      data: dispatchInvoice.rows,
    });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getDispatchPatternInvoiceByDispatchInvoiceId = async (req, res, next) => {
  try {
    const { pattern_invoice_id } = req.body;
    const condition = {
      [Op.and]: [
        { deleted: false },
        { invoice_type: "pattern" },
        { pattern_invoice_id },
      ],
    };

    const dispatchInvoice = await PatternInvoice.findOne({
      where: { ...condition },
      attributes: [
        "pattern_invoice_id",
        "invoice_date",
        "invoice_no",
        "invoice_type",
        "status",
        "createdAt",
      ],
      include: [
        {
          model: DispatchConsignee,
          required: true,
          attributes: [
            "dispatch_consignee_id",
            "customer_id",
            "vender_code",
            "name",
            "mobile",
            "phone",
            "email",
            "pan",
            "gst_no",
          ],
          include: [
            {
              model: DispatchConsigneeAddress,
              required: true,
              attributes: [
                "dispatch_address_id",
                "address_id",
                "address",
                "city",
                "zip_code",
                "state",
                "country",
              ],
            },
          ],
        },
        {
          model: DispatchBuyer,
          required: true,
          attributes: [
            "dispatch_buyer_id",
            "customer_id",
            "vender_code",
            "name",
            "mobile",
            "phone",
            "email",
            "pan",
            "gst_no",
          ],
        },
        {
          model: DispatchShippingAddress,
          required: true,
          attributes: [
            "dispatch_shipping_address_id",
            "shipping_address_id",
            "address",
            "city",
            "zip_code",
            "state",
            "country",
            "contact_person",
            "contact_phone",
          ],
        },
        {
          model: PatternInvoiceList,
          required: true,
          attributes: [
            "pattern_invoice_list_id",
            "item_quantity",
            "product_id",
            "item_name",
            "item_code",
            "no",
            "rate",
            "pump_model",
            "unit_measurement",
            "hsn_code",
            "remark",
            // "description",
          ],
          include: [
            {
              model: Po,
              required: false,
              attributes: ["po_id", "number", "date", "currency_type"],
            },
            {
              model: PoList,
              required: false,
              attributes: [
                "po_list_id",
                "project_no",
                "serial_number",
                "quantity",
                "unit_price",
                "net_amount",
                "delivery_date",
                "description",
                "accept_delivery_date",
                "accept_description",
              ],
            },
          ],
        },
        {
          model: DispatchBankDetails,
          required: true,
          attributes: [
            "dispatch_bank_id",
            "beneficiary_name",
            "branch_name",
            "bank_name",
            "account_no",
            "ifsc_code",
            "swift_code",
            "bank_ad_code",
            "branch_address",
            "account_type",
          ],
        },
        {
          model: DispatchShippingDetails,
          required: true,
          attributes: [
            "dispatch_shipping_details_id",
            "pre_carriage_by",
            "place_of_receipt",
            "port_of_discharge",
            "country_of_goods",
            "destination",
            "port_of_loading",
            "final_destination",
          ],
        },
        {
          model: DispatchCompanyDetails,
          required: true,
          attributes: [
            "dispatch_company_details_id",
            "iec_code",
            "gstin",
            "itc_code",
            "duty_drawback_serial_no",
          ],
        },
        {
          model: DispatchShippingAndOtherDetails,
          required: true,
          attributes: [
            "dispatch_shipping_and_other_details_id",
            "end_use_code",
            "packing_details",
            "bill_type",
            "payment_term",
            "i_gst",
            "remark",
            "vehicle_no",
            "excise_document",
            "freight",
            "shipping_term",
            "shipping_line",
            "shipping_insurance",
            "convert_rate",
          ],
        },
      ],
    });
    if (!dispatchInvoice) {
      return next(globalError(200, "Invoice not found"));
    }
    return res
      .status(200)
      .json({ success: true, data: dispatchInvoice.toJSON() });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = {
  getAllPatternInvoiceWithPagination,
  getDispatchPatternInvoiceByDispatchInvoiceId,
};
