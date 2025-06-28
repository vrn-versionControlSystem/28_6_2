const dayjs = require("dayjs");
const DispatchInvoice = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const globalError = require("../../../../../../errors/global.error");
const DispatchItem = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const DispatchShippingAndOtherDetails = require("../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_shipping_other_details");

const { sequelize } = require("../../../../../../configs/database");
const PoListModel = require("../../../../../../models/company.models/po_and_poList.models/po_list.model");
const { toUpperCase, trimSpace, toUpperCaseOrNull, } = require("../../../../../../utils/helpers/text_checker");

const newDispatchInvoiceRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { invoice_type, invoice_date = new Date(), invoice_no } = req.body;
    const value = {
      invoice_type,
      invoice_date: dayjs(invoice_date).format("YYYY-MM-DD"),
      invoice_no: toUpperCaseOrNull(trimSpace(invoice_no)),
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],

    };
    const newDispatchInvoice = await DispatchInvoice.create(value, {
      transaction: t,
      returning: true,
    });
    if (!newDispatchInvoice) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    req.dispatchInvoice = newDispatchInvoice.toJSON();
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    return next(globalError(500, error.message));
  }
};

// const checkRemainingQuantity = async (req, res, next) => {
//   try {
//     const { DispatchList = [] } = req.body;
//     const value = DispatchList.flatMap((item) => {
//       return item.poList.map((list) => {
//         const { PoList, quantity, weight, Po } = list;
//         return {
//           po_list_id: PoList.po_list_id,
//           product_name: PoList?.Product?.name,
//           po_number: Po?.number,
//           serial_number: PoList?.serial_number,
//           item_quantity: quantity,
//           item_weight: weight,
//         };
//       });
//     });

//     const totalQuantities = await Promise.all(
//       value.map(async (item) => {
//         const totalQuantity = await PoListModel.sum("quantity", {
//           where: { po_list_id: item.po_list_id },
//         });
//         return { po_list_id: item.po_list_id, totalQuantity };
//       })
//     );

//     const errors = [];
//     for (const item of value) {
//       const totalQuantity = totalQuantities.find(
//         (q) => q.po_list_id === item.po_list_id
//       ).totalQuantity;
//       const dispatchedQuantity = await DispatchItem.sum("item_quantity", {
//         where: { po_list_id: item.po_list_id },
//       });
//       const remainingQuantity = totalQuantity - dispatchedQuantity;

//       if (item.item_quantity > remainingQuantity) {
//         errors.push(
//           `${
//             remainingQuantity === 0
//               ? `you cannot dispatch the ${item?.product_name}, ${
//                   item?.po_number - item?.serial_number
//                 } as it already has been dispatched with its total quantity ordered`
//               : `For ${item?.product_name}, ${
//                   item?.po_number - item?.serial_number
//                 }, ${dispatchedQuantity} quantity has already been dispatched you can dispatch ${remainingQuantity} quantity`
//           }`
//         );
//       }
//     }

//     if (errors.length > 0) {
//       return res.status(400).json({ success: false, message: errors[0] });
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({ error: "Failed to check remaining quantity" });
//   }
// };

const checkRemainingQuantity = async (req, res, next) => {
  try {
    const { DispatchList = [] } = req.body;

    const value = DispatchList.flatMap((item) =>
      item.poList.map((list) => ({
        po_list_id: list.PoList.po_list_id,
        product_name: list.PoList?.Product?.name,
        po_number: list.Po?.number,
        serial_number: list.PoList?.serial_number,
        item_quantity: list.quantity,
        item_weight: list.weight,
        row_charges: list.row_charges || 0,
        machining_charges: list.machining_charges || 0,
      }))
    );

    const totalQuantities = await PoListModel.findAll({
      where: { po_list_id: value.map((item) => item.po_list_id) },
      attributes: ["po_list_id", [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"]],
      group: ["po_list_id"],
      raw: true,
    });

    const quantityMap = totalQuantities.reduce((map, item) => {
      map[item.po_list_id] = item.totalQuantity;
      return map;
    }, {});

    const errors = [];
    for (const item of value) {
      const totalQuantity = quantityMap[item.po_list_id] || 0;


      const dispatchItemData = await DispatchItem.findAll({
        where: { po_list_id: item.po_list_id },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("item_quantity")), "totalDispatchedQuantity"],
          [sequelize.fn("SUM", sequelize.col("row_charges")), "totalRowCharges"],
          [sequelize.fn("SUM", sequelize.col("machining_charges")), "totalMachiningCharges"],
          [sequelize.fn("SUM", sequelize.col("other_charges")), "totalOtherCharges"],
        ],
        raw: true,
      });

      const dispatchedQuantity = dispatchItemData[0]?.totalDispatchedQuantity || 0;
      const remainingQuantity = totalQuantity - dispatchedQuantity;

      if (item.item_quantity > remainingQuantity) {
        errors.push(
          remainingQuantity === 0
            ? `You cannot dispatch ${item.product_name}, PO ${item.po_number} - Serial ${item.serial_number} as the total quantity has already been dispatched.`
            : `For ${item.product_name}, PO ${item.po_number} - Serial ${item.serial_number}, ${dispatchedQuantity} quantity has already been dispatched. You can dispatch only ${remainingQuantity} more.`
        );
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to check remaining quantity" });
  }
};

const checkRemainingQuantityProductAdd = async (req, res, next) => {
  try {
    const { item = {} } = req.body;

    const { PoList, quantity, weight, Po } = item;
    const value = {
      po_list_id: PoList.po_list_id,
      product_name: PoList?.Product?.name,
      po_number: Po?.number,
      serial_number: PoList?.serial_number,
      item_quantity: quantity,
      item_weight: weight,
    };

    let totalQuantities = {};

    const totalQuantity = await PoListModel.sum("quantity", {
      where: { po_list_id: value.po_list_id },
    });
    totalQuantities = { po_list_id: value.po_list_id, totalQuantity };

    const errors = [];

    const dispatchedQuantity = await DispatchItem.sum("item_quantity", {
      where: { po_list_id: value.po_list_id },
    });
    const remainingQuantity =
      totalQuantities.totalQuantity - dispatchedQuantity;

    if (value.item_quantity > remainingQuantity) {
      errors.push(
        `${remainingQuantity === 0
          ? `you cannot Add the ${value?.product_name}, ${value?.po_number - value?.serial_number
          } as it already has been dispatched with its total quantity ordered`
          : `For ${value?.product_name}, ${value?.po_number - value?.serial_number
          }, ${dispatchedQuantity} quantity has already been dispatched you can Add ${remainingQuantity} quantity`
        }`
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    return next();
  } catch (error) {
    res.status(500).json({ message: "Failed To Check Remainig Quantity" });
  }
};

module.exports = {
  newDispatchInvoiceRegistration,
  checkRemainingQuantity,
  checkRemainingQuantityProductAdd,
};
