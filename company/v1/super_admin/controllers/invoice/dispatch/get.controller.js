const { Op, cast, col } = require("sequelize");

const globalError = require("../../../../../../errors/global.error");
const DispatchInvoice = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const DispatchConsignee = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_consignee");
const DispatchConsigneeAddress = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_consignee_address");
const DispatchBuyer = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_buyer");
const DispatchShippingAddress = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_address");
const DispatchBoxList = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_box_list");
const DispatchLocation = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_location");
const DispatchList = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const DispatchNote = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_note");
const DispatchBankDetails = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_bank_details");
const DispatchShippingDetails = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_details");
const DispatchCompanyDetails = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_company_details");
const DispatchShippingAndOtherDetails = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_other_details");
const Po = require("../../../../../../models/company.models/po_and_poList.models/po.model");
const PoList = require("../../../../../../models/company.models/po_and_poList.models/po_list.model");
const { sequelize } = require("../../../../../../configs/database");
// const db = require("../../../../");

const getAllDispatchInvoiceWithPagination = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      customer_id = "",
      invoice_no = "",
      invoice_date = "",
      reg_date = "",
      type = "",
      query = "",
      year = "",
      months = "",
    } = req.body;

    const condition = {
      [Op.and]: [{ deleted: false }],
    };
    const customerCondition = {
      [Op.and]: [],
    };
    const customerConditionForAllInvoices = {
      [Op.and]: [{ deleted: false }],
    };

    if (type) {
      condition[Op.and].push({ invoice_type: type });
    }
    if (customer_id && JSON.parse(customer_id).length > 0) {
      const customerIds = JSON.parse(customer_id);
      if (Array.isArray(customerIds)) {
        customerCondition[Op.and].push({
          customer_id: { [Op.in]: customerIds },
        });
      }
    }

    if (invoice_date && JSON.parse(invoice_date).length > 0) {
      const invoiceDate = JSON.parse(invoice_date);
      if (Array.isArray(invoiceDate)) {
        condition[Op.and].push({ invoice_date: { [Op.in]: invoiceDate } });
        customerConditionForAllInvoices[Op.and].push({
          invoice_date: { [Op.in]: invoiceDate },
        });
      }
    }

    if (invoice_no && JSON.parse(invoice_no).length > 0) {
      const invoiceNos = JSON.parse(invoice_no);
      if (Array.isArray(invoiceNos)) {
        condition[Op.and].push({ invoice_no: { [Op.in]: invoiceNos } });
      }
    }

    if (year && JSON.parse(year).length > 0) {
      const years = JSON.parse(year);
      condition[Op.and].push({
        [Op.and]: sequelize.literal(
          `YEAR(invoice_date) IN (${years.join(",")})`
        ),
      });

      customerConditionForAllInvoices[Op.and].push({
        [Op.and]: sequelize.literal(
          `YEAR(invoice_date) IN (${years.join(",")})`
        ),
      });
    }

    if (months && JSON.parse(months).length > 0) {
      const monthNames = JSON.parse(months);
      const monthNumbers = monthNames.map(
        (name) => new Date(`${name} 1, 2000`).getMonth() + 1
      );

      condition[Op.and].push({
        [Op.and]: sequelize.literal(
          `MONTH(invoice_date) IN (${monthNumbers.join(",")})`
        ),
      });
      customerConditionForAllInvoices[Op.and].push({
        [Op.and]: sequelize.literal(
          `MONTH(invoice_date) IN (${monthNumbers.join(",")})`
        ),
      });
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

    const dispatchInvoice = await DispatchInvoice.findAndCountAll({
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
      order: [["invoice_no", "DESC"]],
    });

    let response = {
      success: true,
      total: dispatchInvoice.count,
      data: dispatchInvoice.rows,
    };

    if (
      (customer_id && JSON.parse(customer_id).length > 0) ||
      (year && JSON.parse(year).length > 0) ||
      (months && JSON.parse(months).length > 0)
    ) {
      const allInvoiceAndDates = await DispatchInvoice.findAndCountAll({
        where: { ...customerConditionForAllInvoices },
        order: [["createdAt", "DESC"]],
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
        order: [["invoice_no", "DESC"]],
      });

      const groupedInvoices = allInvoiceAndDates.rows.reduce((acc, invoice) => {
        const invoiceDate = invoice.invoice_date;
        if (!acc[invoiceDate]) {
          acc[invoiceDate] = [];
        }
        acc[invoiceDate].push(invoice);
        return acc;
      }, {});

      response.customerInvoiceDates = Object.keys(groupedInvoices).map(
        (date) => ({
          date,
          invoices: groupedInvoices[date],
        })
      );
    }

    return res.status(200).json(response);
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getDispatchForeignInvoiceByDispatchInvoiceId = async (req, res, next) => {
  try {
    const { dispatch_invoice_id } = req.body;
    const condition = {
      [Op.and]: [
        { deleted: false },
        { invoice_type: "foreign" },
        { dispatch_invoice_id },
      ],
    };

    let dispatchInvoice = await DispatchInvoice.findOne({
      where: { ...condition },
      attributes: [
        "dispatch_invoice_id",
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
          model: DispatchBoxList,
          required: true,
          attributes: [
            "dispatch_box_list_id",
            "box_no",
            "box_length",
            "box_height",
            "box_breadth",
            "box_size_type",
            "tare_weight",
          ],
        },
        {
          model: DispatchLocation,
          required: true,
          attributes: ["dispatch_location_id", "location_code"],
          include: [
            {
              model: DispatchList,
              required: true,
              attributes: [
                "dispatch_list_id",
                "item_quantity",
                "item_weight",
                "dispatch_location_id",
                "dispatch_box_id",
                "product_id",
                "item_name",
                "item_code",
                "pump_model",
                "unit_measurement",
                "hsn_code",
                "description",
                "gst_percentage",
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
          ],
        },
        {
          model: DispatchNote,
          required: true,
          attributes: ["dispatch_note_id", "name", "condition", "condition_id"],
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
      order: [
        [
          { model: DispatchLocation },
          { model: DispatchList },
          { model: Po },
          "number",
          "ASC",
        ],
        [
          { model: DispatchLocation },
          { model: DispatchList },
          { model: PoList },
          "serial_number",
          "ASC",
        ],
        [
          { model: DispatchLocation },
          { model: DispatchList },
          { model: PoList },
          "project_no",
          "ASC",
        ],
        [{ model: DispatchBoxList }, "box_no", "ASC"],
      ],
    });
    if (!dispatchInvoice) {
      return next(globalError(200, "Invoice not found"));
    }

    const dispatchLocations = dispatchInvoice.DispatchLocations || [];

    // Step 1: Collect all dispatchItems grouped by po_id
    const poStatusMap = {}; // { po_id: { total: n, matched: m } }

    for (const location of dispatchLocations) {
      const dispatchLists = location.DispatchLists || [];

      for (const dispatchItem of dispatchLists) {
        const po = dispatchItem?.Po;
        const poList = dispatchItem?.PoList;

        if (!po || !po.po_id || !poList) {
          continue;
        }

        const po_id = po.po_id;
        const itemQuantity = Number(dispatchItem.item_quantity || 0);
        const poQuantity = Number(poList.quantity || 0);

        if (!poStatusMap[po_id]) {
          poStatusMap[po_id] = { total: 0, matched: 0 };
        }

        poStatusMap[po_id].total += 1;
        if (itemQuantity === poQuantity) {
          poStatusMap[po_id].matched += 1;
        }
      }
    }

    // Step 2: Evaluate and update each PO status once
    for (const po_id in poStatusMap) {
      const { total, matched } = poStatusMap[po_id];
      const newStatus = total === matched ? "delivered" : "processing";

      try {
        await sequelize.query(
          `UPDATE pos SET status = :newStatus, updatedAt = NOW() WHERE po_id = :po_id`,
          {
            replacements: {
              newStatus,
              po_id,
            },
          }
        );
        console.log(`✅ PO ${po_id} updated to ${newStatus}`);
      } catch (err) {
        console.error(`❌ Failed to update PO ${po_id}:`, err.message);
      }
    }
    return res
      .status(200)
      .json({ success: true, data: dispatchInvoice.toJSON() });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getDispatchDomesticInvoiceByDispatchInvoiceId = async (
  req,
  res,
  next
) => {
  try {
    const { dispatch_invoice_id } = req.body;

    const condition = {
      [Op.and]: [
        { deleted: false },
        { invoice_type: "domestic" },
        { dispatch_invoice_id },
      ],
    };

    const dispatchInvoice = await DispatchInvoice.findOne({
      where: condition,
      attributes: [
        "dispatch_invoice_id",
        "invoice_date",
        "invoice_type",
        "invoice_no",
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
                "state_code",
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
            "state_code",
          ],
        },
        {
          model: DispatchLocation,
          required: true,
          attributes: ["dispatch_location_id", "location_code"],
          include: [
            {
              model: DispatchList,
              required: true,
              attributes: [
                "dispatch_list_id",
                "item_quantity",
                "item_weight",
                "dispatch_location_id",
                "dispatch_box_id",
                "product_id",
                "item_name",
                "item_code",
                "pump_model",
                "unit_measurement",
                "hsn_code",
                "description",
                "gst_percentage",
                "remarks",
                "row_charges",
                "machining_charges",
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
            "state",
            "state_code",
            "pan",
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
            "i_gst",
            "c_gst",
            "s_gst",
            "remark",
            "vehicle_no",
            "excise_document",
            "freight",
            "shipping_term",
            "shipping_line",
            "shipping_insurance",
            "convert_rate",
            "e_way_bill_no",
            "packing_charges",
            "fright_charges",
            "other_charges",
          ],
        },
      ],
      order: [
        [
          { model: DispatchLocation },
          { model: DispatchList },
          { model: Po },
          "number",
          "ASC",
        ],
        [
          { model: DispatchLocation },
          { model: DispatchList },
          { model: PoList },
          "serial_number",
          "ASC",
        ],
        [
          { model: DispatchLocation },
          { model: DispatchList },
          { model: PoList },
          "project_no",
          "ASC",
        ],
      ],
    });

    if (!dispatchInvoice) {
      return next(globalError(200, "Invoice not found"));
    }

    const dispatchLocations = dispatchInvoice.DispatchLocations || [];

    // Step 1: Collect all dispatchItems grouped by po_id
    const poStatusMap = {}; // { po_id: { total: n, matched: m } }

    for (const location of dispatchLocations) {
      const dispatchLists = location.DispatchLists || [];

      for (const dispatchItem of dispatchLists) {
        const po = dispatchItem?.Po;
        const poList = dispatchItem?.PoList;

        if (!po || !po.po_id || !poList) {
          continue;
        }

        const po_id = po.po_id;
        const itemQuantity = Number(dispatchItem.item_quantity || 0);
        const poQuantity = Number(poList.quantity || 0);

        if (!poStatusMap[po_id]) {
          poStatusMap[po_id] = { total: 0, matched: 0 };
        }

        poStatusMap[po_id].total += 1;
        if (itemQuantity === poQuantity) {
          poStatusMap[po_id].matched += 1;
        }
      }
    }

    // Step 2: Evaluate and update each PO status once
    for (const po_id in poStatusMap) {
      const { total, matched } = poStatusMap[po_id];
      const newStatus = total === matched ? "delivered" : "processing";

      try {
        await sequelize.query(
          `UPDATE pos SET status = :newStatus, updatedAt = NOW() WHERE po_id = :po_id`,
          {
            replacements: {
              newStatus,
              po_id,
            },
          }
        );
        console.log(`✅ PO ${po_id} updated to ${newStatus}`);
      } catch (err) {
        console.error(`❌ Failed to update PO ${po_id}:`, err.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: dispatchInvoice.toJSON(),
    });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getDispatchDomesticInvoiceByDispatchInvoiceIdTest = async (
  req,
  res,
  next
) => {
  try {
    const { dispatch_invoice_id } = req.body;
    const condition = {
      [Op.and]: [
        { deleted: false },
        { invoice_type: "domestic" },
        { dispatch_invoice_id },
      ],
    };

    const dispatchInvoice = await DispatchInvoice.findOne({
      where: { ...condition },
      attributes: [
        "dispatch_invoice_id",
        "invoice_date",
        "invoice_type",
        "invoice_no",
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
                "state_code",
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
            "state_code",
          ],
        },
        {
          model: DispatchLocation,
          required: true,
          attributes: ["dispatch_location_id", "location_code"],
          include: [
            {
              model: DispatchList,
              required: true,
              attributes: [
                "dispatch_list_id",
                "item_quantity",
                "item_weight",
                "dispatch_location_id",
                "dispatch_box_id",
                "product_id",
                "item_name",
                "item_code",
                "pump_model",
                "unit_measurement",
                "hsn_code",
                "description",
                "gst_percentage",
                "row_charges",
                "machining_charges",
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
            "state",
            "state_code",
            "pan",
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
            "i_gst",
            "c_gst",
            "s_gst",
            "remark",
            "vehicle_no",
            "excise_document",
            "freight",
            "shipping_term",
            "shipping_line",
            "shipping_insurance",
            "convert_rate",
            "e_way_bill_no",
            "packing_charges",
            "payment_term",
            "other_charges",
          ],
        },
      ],
    });

    if (!dispatchInvoice) {
      return next(globalError(200, "Invoice not found"));
    }

    // Renaming the properties
    const invoiceData = dispatchInvoice.toJSON();

    // Rename DispatchLocations to DispatchList
    invoiceData.DispatchList = invoiceData.DispatchLocations;
    delete invoiceData.DispatchLocations;

    // Logging to verify structur

    // Iterate over the renamed DispatchList and rename DispatchLists to PoList
    invoiceData.DispatchList.forEach((location) => {
      location.PoList = location.DispatchLists;
      delete location.DispatchLists;
    });

    // Rename other details
    invoiceData.DispatchBankDetails = invoiceData.DispatchBankDetail;
    delete invoiceData.DispatchBankDetail;

    invoiceData.DispatchCompanyDetails = invoiceData.DispatchCompanyDetail;
    delete invoiceData.DispatchCompanyDetail;

    invoiceData.DispatchShippingAndOtherDetails =
      invoiceData.DispatchShippingAndOtherDetail;
    delete invoiceData.DispatchShippingAndOtherDetail;

    return res.status(200).json({ success: true, data: invoiceData });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllInvoiceNumber = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const dispatchInvoice = await DispatchInvoice.findAll({
      where: { ...condition },
      attributes: ["dispatch_invoice_id", "invoice_no"],
      order: [["createdAt", "ASC"]],
    });
    if (dispatchInvoice.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
    const data = dispatchInvoice.map((m) => {
      return { label: m.invoice_no, value: m.invoice_no };
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllInvoiceDate = async (req, res, next) => {
  try {
    const que = `
        SELECT DISTINCT DATE(invoice_date) AS invoice_date
        FROM dispatch_invoice
        WHERE 1 
        ORDER BY DATE(invoice_date);              
      `;

    const [results, metadata] = await sequelize.query(que);

    if (results[0].length === 0) {
      res.status(200).json({
        success: true,
        data: results[0],
        message: "No Invoice Has Been Created",
      });
    }

    const data = results.map((dat) => {
      return { label: dat.invoice_date, value: dat.invoice_date };
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getUniqueYears = async (req, res, next) => {
  try {
    const que = `
          SELECT DISTINCT YEAR(invoice_date) AS year
FROM dispatch_invoice
ORDER BY year ASC;             
      `;

    const [results, metadata] = await sequelize.query(que);

    if (results[0].length === 0) {
      res.status(200).json({
        success: true,
        data: results[0],
        message: "No Invoice Has Been Created",
      });
    }

    const data = results.map((yr) => {
      return { label: yr.year, value: yr.year };
    });
    data.unshift({ label: "All", value: "" });
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getUniqueMonths = async (req, res, next) => {
  try {
    const { year = "" } = req.body;
    let yearCondition = "";

    if (year && JSON.parse(year).length > 0) {
      let years = JSON.parse(year);
      yearCondition = ` AND YEAR(invoice_date) IN (${years.join(",")}) `;
    }

    const que = `
       SELECT 
           DISTINCT(DATE_FORMAT(invoice_date, '%b')) AS MONTH_NAME,
           MONTH(invoice_date) AS MONTH_NUMBER
       FROM
           dispatch_invoice
       WHERE 
           1 ${yearCondition}
       ORDER BY MONTH_NUMBER ASC
    `;

    const [results, metadata] = await sequelize.query(que);

    const data = results.map((mon) => {
      return { label: mon.MONTH_NAME, value: mon.MONTH_NAME };
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getAllDispatchInvoiceWithPagination,
  getDispatchForeignInvoiceByDispatchInvoiceId,
  getDispatchDomesticInvoiceByDispatchInvoiceId,
  getDispatchDomesticInvoiceByDispatchInvoiceIdTest,
  getAllInvoiceNumber,
  getAllInvoiceDate,
  getUniqueYears,
  getUniqueMonths,
};
