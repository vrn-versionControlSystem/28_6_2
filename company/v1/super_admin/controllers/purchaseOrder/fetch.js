const { Op } = require("sequelize");
const PurchaseOrder = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/purchaseOrder");
const PoList = require("../../../../../models/company.models/po_and_poList.models/po_list.model");
const PurchaseOrderList = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/PurchaseOrderList");
const Product = require("../../../../../models/company.models/product.models/product.model");
const globalError = require("../../../../../errors/global.error");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");
const Category = require("../../../../../models/company.models/product.models/category.model");
const CustomerPermanentAddress = require("../../../../../models/company.models/customer.models/customer_permanent_address.model");
const Drawing = require("../../../../../models/company.models/product.models/drawing.model");

const getAllPurchaseOrderWithPagination = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "", status = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { status: status }],
    };

    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          {
            number: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      });
    }

    const po = await PurchaseOrder.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      distinct: true,
      order: [["createdAt", "DESC"]],
      attributes: [
        "purchase_order_id",
        "number",
        "status",
        "currency_type",
        "date",
        "status_remark",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Customer,
          attributes: [
            "customer_id",
            "customer_code",
            "vender_code",
            "name",
            "status",
            "mobile",
            "phone",
            "email",
            "pan",
            "gst_no",
            "type",
            "createdAt",
          ],
          include: [
            {
              model: CustomerPermanentAddress,
            },
          ],
        },
      ],
    });
    return res
      .status(200)
      .json({ success: true, total: po.count, data: po.rows });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getPurchaseOrderDetailsByPurchaseOrderId = async (req, res, next) => {
  try {
    const { purchase_order_id } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }, { status: "pending" }],
    };

    const po = await PurchaseOrder.findByPk(purchase_order_id, {
      where: { ...condition },
      attributes: [
        "purchase_order_id",
        "status",
        "number",
        "currency_type",
        "customer_id",
        "date",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: PurchaseOrderList,
          attributes: [
            "purchase_order_list_id",
            "quantity",
            "gst_type",
            "gst",
            "price",
            "amount",
            "list_status",
            "received_quantity",
            "delivery_date",
            "remarks",
          ],
          include: [
            {
              model: Product,
              attributes: [
                "product_id",
                "category_id",
                "name",
                "item_code",
                "product_code",
                "unit_measurement",
                "standard_lead_time",
                "standard_lead_time_type",
                "drawing_number",
              ],
              include: [
                {
                  model: Category,
                  attributes: ["category_id", "name"],
                },
              ],
              include: [
                {
                  model: Drawing,
                  attributes: ["drawing_id", "revision_number"],
                },
              ],
            },
          ],
        },
        {
          model: Customer,
          attributes: [
            "customer_id",
            "customer_code",
            "vender_code",
            "name",
            "status",
            "mobile",
            "phone",
            "email",
            "pan",
            "gst_no",
            "type",
            "createdAt",
          ],
          include: [
            {
              model: CustomerPermanentAddress,
            },
          ],
        },
      ],
    });

    if (!po) {
      return next(globalError(200, "Purchase Order not found"));
    }
    return res.status(200).json({ success: true, data: po.toJSON() });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

// const getAllPoProducts = async (req, res, next) => {
//   try {
//     const { pageIndex = 1, pageSize = 10, query = "", status } = req.query;

//     const condition = {
//       [Op.and]: [{ deleted: false }],
//     };

//     const { count, rows: po } = await Po.findAndCountAll({
//       where: { ...condition },
//       attributes: [
//         "po_id",
//         "poa",
//         "status",
//         "number",
//         "currency_type",
//         "date",
//         "createdAt",
//         "updatedAt",
//       ],
//       include: [
//         {
//           model: PoList,
//           attributes: [
//             "po_list_id",
//             "serial_number",
//             "project_no",
//             "quantity",
//             "unit_price",
//             "net_amount",
//             "delivery_date",
//             "description",
//             "accept_description",
//             "accept_delivery_date",
//             "list_status",
//             "createdAt",
//           ],
//           include: [
//             {
//               model: Product,
//               attributes: [
//                 "product_id",
//                 "name",
//                 "item_code",
//                 "product_code",
//                 "unit_measurement",
//                 "standard_lead_time",
//                 "standard_lead_time_type",
//                 "drawing_number",
//               ],
//             },
//             {
//               model: Drawing,
//               attributes: ["drawing_id", "revision_number"],
//             },
//           ],
//         },
//         {
//           model: Customer,
//           attributes: [
//             "customer_id",
//             "customer_code",
//             "vender_code",
//             "name",
//             "status",
//             "mobile",
//             "phone",
//             "email",
//             "pan",
//             "gst_no",
//             "type",
//             "createdAt",
//           ],
//         },
//       ],
//       limit: +pageSize,
//       offset: (+pageIndex - 1) * +pageSize,
//     });

//     if (!po) {
//       return next(globalError(200, "Po not found"));
//     }
//     if (count === 0) {
//       return res.status(200).json({ success: true, data: [], total: 0 });
//     }

//     const data = po?.map((obj) => {
//       let { ...otherData } = obj.toJSON();

//       return otherData;
//     });

//     let combinedPoLists = [];

//     data.forEach((item) => {
//       let customerName = item.Customer.name;

//       let poLists = item.PoLists.map((po) => ({
//         ...po,
//         customer_name: customerName,
//       }));
//       combinedPoLists = combinedPoLists.concat(poLists);
//     });
//     return res
//       .status(200)
//       .json({ success: true, data: combinedPoLists, total: count });
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

// const getAllPosByCustomerId = async (req, res, next) => {
//   try {
//     const { customer_id, currency_type, status = "processing" } = req.body;

//     const condition = {
//       [Op.and]: [
//         { deleted: false },
//         { status },
//         { customer_id },
//         { currency_type },
//       ],
//     };

//     const po = await Po.findAll({
//       where: { ...condition },
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: [
//         "po_id",
//         "poa",
//         "number",
//         "currency_type",
//         "date",
//         "status",
//         "createdAt",
//       ],
//       include: [
//         {
//           model: PoList,
//           where: {
//             list_status: "accepted",
//           },
//           attributes: [
//             "po_list_id",
//             "serial_number",
//             "quantity",
//             "unit_price",
//             "delivery_date",
//             "accept_delivery_date",
//           ],
//           include: [
//             {
//               model: Product,
//               attributes: [
//                 "product_id",
//                 "name",
//                 "item_code",
//                 "product_code",
//                 "unit_measurement",
//                 "hsn_code",
//               ],
//             },
//           ],
//         },
//       ],
//     });
//     return res.status(200).json({ success: true, data: po });
//   } catch (error) {
//     next(globalError(500, "Internal server error"));
//   }
// };

// const latest10Pos = async (req, res, next) => {
//   try {
//     const condition = {
//       [Op.and]: [{ deleted: false }],
//     };

//     const po = await Po.findAll({
//       where: { ...condition },
//       limit: 10,
//       order: [["createdAt", "DESC"]],
//       attributes: [
//         "po_id",
//         "poa",
//         "number",
//         "currency_type",
//         "date",
//         "status",
//         "createdAt",
//       ],
//     });

//     req.POs = po;
//     return next();
//   } catch (error) {
//     next(globalError(500, "Internal server error"));
//   }
// };

module.exports = {
  getAllPurchaseOrderWithPagination,
  getPurchaseOrderDetailsByPurchaseOrderId,
  //   getPoDetailsByPoId,
  //   getAllPosByCustomerId,
  //   latest10Pos,
  //   getAllPoProducts,
};
