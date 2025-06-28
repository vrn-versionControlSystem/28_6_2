const globalError = require("../../../../../../errors/global.error");
const PatternInvoiceList = require("../../../../../../models/company.models/invoice.models/pattern_invoice.models/pattern_invoice_list");
const Pattern = require("../../../../../../models/company.models/product.models/pattern.model");
const Product = require("../../../../../../models/company.models/product.models/product.model");
const {
  trimSpace,
  toUpperCase,
} = require("../../../../../../utils/helpers/text_checker");

const updatePatternDetailsByPatternId = async (req, res, next) => {
  try {
    const {
      status = false,
      number,
      description,
      availability = false,
      pattern_id,
      customer_id,
      storage_location,
    } = req.body;
    const value = {
      status,
      number,
      availability,
      description,
      customer_id,
      storage_location: toUpperCase(storage_location),
    };
    const pattern = await Pattern.update(value, {
      where: {
        pattern_id,
      },
    });
    if (pattern[0] === 0) {
      return next(globalError(404, "Pattern not found"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Pattern successfully updated" });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

const deletePatternByPatternId = async (req, res, next) => {
  try {
    const { pattern_id } = req.body;

    const activeProduct = await Product.findOne({
      where: {
        pattern_id,
        deleted: false,
      },
    });

    if (activeProduct) {
      return next(
        globalError(400, "Cannot delete: Pattern is used by an active Products")
      );
    }

    const deleted = await Pattern.update(
      { deleted: true },
      {
        where: { pattern_id },
      }
    );

    if (deleted === 0) {
      return next(globalError(404, "Pattern not found"));
    }

    return res
      .status(200)
      .json({ success: true, message: "Pattern successfully deleted" });
  } catch (error) {
    console.error("Error deleting pattern:", error);
    return next(globalError(500, "Internal server error"));
  }
};

const updatePatternDispatchListByAddItem = async (req, res, next) => {
  try {
    const { item = {}, pattern_invoice_id } = req.body;

    console.log("request body:", req.body);

    const { Po, PoList, quantity, no, rate, remarks = "" } = item;

    // Find the correct PoList from Po.PoLists array
    const selectedPoList = Po.PoLists.find(
      (poList) => poList.po_list_id === PoList.po_list_id
    );

    if (!selectedPoList) {
      return next(globalError(400, "Invalid PoList ID"));
    }

    const {
      Product: {
        name,
        item_code,
        product_id,
        hsn_code,
        unit_measurement,
        Drawings = [],
      },
      serial_number,
      project_no,
      unit_price,
      delivery_date,
    } = selectedPoList;

    // Extract weight data from Drawings array
    const raw_weight = Drawings.length ? Drawings[0].raw_weight || 0 : 0;
    const finish_weight = Drawings.length ? Drawings[0].finish_weight || 0 : 0;

    const value = {
      pattern_invoice_id,
      po_id: Po.po_id,
      po_list_id: selectedPoList.po_list_id,
      serial_number,
      number: Po.number,
      delivery_date,
      item_quantity: quantity || 0, // Default to 0 if missing
      item_weight: finish_weight,
      raw_weight,
      item_name: name,
      item_code,
      product_id,
      unit_measurement,
      hsn_code: hsn_code || "NA",
      rate: unit_price || rate, // Use unit_price if available, otherwise fallback to rate
      remark: remarks,
      no,
    };

    // Insert new dispatch entry
    const newDispatchItems = await PatternInvoiceList.create(value, {
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

module.exports = {
  updatePatternDetailsByPatternId,
  deletePatternByPatternId,
  updatePatternDispatchListByAddItem,
};
