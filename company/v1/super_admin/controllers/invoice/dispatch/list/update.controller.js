const { sequelize } = require("../../../../../../../configs/database");
const globalError = require("../../../../../../../errors/global.error");
const DispatchList = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const {
  toUpperCase,
  trimSpace,
} = require("../../../../../../../utils/helpers/text_checker");
const dayjs = require("dayjs");
const updateDispatchListByDispatchListId = async (req, res, next) => {
  try {
    const {
      item_quantity = 0,
      dispatch_list_id,
      remarks = "",
      Po,
      PoList,
    } = req.body;

    console.log("request body", req.body);
    const value = {
      item_quantity,
      remarks,
    };
    const updatedDispatchList = await DispatchList.update(value, {
      where: { dispatch_list_id },
    });

    if (updatedDispatchList[0] === 0) {
      return next(globalError(404, "Dispatch item not found"));
    }

    if (PoList && Po && Po.po_id) {
      const status =
        item_quantity === PoList.quantity ? "delivered" : "processing";

      await sequelize.query(
        `UPDATE pos SET status = :newStatus, updatedAt = NOW() WHERE po_id = :po_id`,
        {
          replacements: { newStatus: status, po_id: Po.po_id },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      console.log(`PO status set to "${status}" for po_id: ${Po.po_id}`);
    }
    return res
      .status(200)
      .json({ success: true, message: "Dispatch item successfully updated" });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

const updateDispatchListByAddItem = async (req, res, next) => {
  try {
    const {
      item = {},
      dispatch_location_id,
      dispatch_invoice_id,
      dispatch_box_list_id = "",
    } = req.body;

    const {
      Po,
      PoList,
      quantity,
      box_no,
      weight,
      remarks = "",
      row_charges,
      machining_charges,
    } = item;
    const { number } = Po;
    const {
      Product: {
        name,
        item_code,
        hsn_code,
        description,
        unit_measurement,
        gst_percentage,
        pump_model,
      },
      project_no,
      serial_number,
      delivery_date,
      po_list_id,
      unit_price,
    } = PoList;
    const value = {
      dispatch_invoice_id: dispatch_invoice_id,
      product_id: PoList.Product.product_id,
      dispatch_location_id: dispatch_location_id,
      po_id: Po.po_id,
      project_no,
      serial_number,
      number,
      delivery_date,
      po_list_id,
      dispatch_box_id: dispatch_box_list_id ? dispatch_box_list_id : null,
      item_quantity: quantity,
      item_weight: weight ? weight : 0,
      item_name: name,
      item_code,
      pump_model,
      unit_measurement,
      hsn_code,
      description,
      gst_percentage,
      rate: unit_price,
      remarks,
      row_charges,
      machining_charges,
    };

    const newDispatchItems = await DispatchList.create(value, {
      returning: true,
    });
    if (!newDispatchItems) {
      return next(globalError(500, "Something went wrong"));
    }
    return res.status(200).json({
      success: true,
      message: "Product Added Successfully",
      data: newDispatchItems,
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const updateRawMachiningDataDispatchById = async (req, res, next) => {
  try {
    const {
      raw_date = null,
      machining_date = null,
      dispatch_list_id,
    } = req.body;
    const value = {};
    if (raw_date) {
      value.raw_date = raw_date === "Invalid Date" ? null : raw_date;
    }
    if (machining_date) {
      value.machining_date =
        machining_date === "Invalid Date" ? null : machining_date;
    }
    const updatedDispatch = await DispatchList.update(value, {
      where: { dispatch_list_id },
    });
    if (updatedDispatch[0] === 0) {
      return next(globalError(404, "Dispatch List not found"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Dispatch successfully updated" });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const updateDispatchListWhenPOisUpdated = async (req, res, next) => {
  const t = req.t;
  try {
    console.log("2");
    const { items = [] } = req.body;

    const incomingPoListIds = items.filter((item) => item.po_list_id);
    console.log("incomingPoListIds", incomingPoListIds);
    const updatePromises = incomingPoListIds.map((item) =>
      DispatchList.update(
        {
          project_no: toUpperCase(trimSpace(item.project_no)),
          serial_number: toUpperCase(trimSpace(item.serial_number)),
          rate: item.unit_price || 0,
          delivery_date: dayjs(item.delivery_date).startOf("day").toDate(),
        },
        {
          where: {
            po_list_id: item.po_list_id,
          },
          transaction: t,
        }
      ).then(([affectedRows]) => {})
    );

    await Promise.all(updatePromises);

    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Dispatch items successfully updated" });
  } catch (error) {
    await t.rollback();
    return next(
      globalError(
        500,
        error.message || "Internal Server Error during dispatch update"
      )
    );
  }
};

module.exports = {
  updateDispatchListByDispatchListId,
  updateRawMachiningDataDispatchById,
  updateDispatchListByAddItem,
  updateDispatchListWhenPOisUpdated,
};
