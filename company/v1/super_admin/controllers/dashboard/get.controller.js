const { Op } = require("sequelize");
const globalError = require("../../../../../errors/global.error");
const DispatchInvoice = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const DispatchConsignee = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_consignee");
const dispatchList = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const dispatchInvoice = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const PurchaseOrder = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/purchaseOrder");
const Po = require("../../../../../models/company.models/po_and_poList.models/po.model");

const Customer = require("../../../../../models/company.models/customer.models/customer.model");

const { sequelize } = require("../../../../../configs/database");

const dayjs = require("dayjs");

const dateResponseFormat = "YYYY-MM-DD";
const dateCount = 10;

const pendingPOs = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [
        { deleted: false },
        {
          status: "pending",
        },
      ],
    };
    const pendingPOs = await Po.count({
      where: {
        ...condition,
      },
    });
    req.statisticData.pendingPOs = pendingPOs;
    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getChartData = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const startOfLastDays = dayjs()
      .subtract(dateCount - 1, "days")
      .startOf("day");

    const invoices = await DispatchInvoice.findAll({
      where: {
        ...condition,
        createdAt: {
          [Op.gte]: startOfLastDays.toDate(),
        },
      },
      raw: true,
    });

    let datesArray = [];
    for (let i = 0; i < dateCount; i++) {
      let date = startOfLastDays.add(i, "days");
      let formattedDate = date.format(dateResponseFormat);
      datesArray.push(formattedDate);
    }

    const invoicesByDate = {};
    datesArray.forEach((date) => {
      invoicesByDate[date] = 0;
    });

    invoices.forEach((invoice) => {
      const invoiceDate = dayjs(invoice.createdAt)
        .startOf("day")
        .format(dateResponseFormat);
      if (invoicesByDate.hasOwnProperty(invoiceDate)) {
        invoicesByDate[invoiceDate] += 1;
      }
    });

    req.chartData = [
      {
        date: Object.keys(invoicesByDate).map((date) =>
          dayjs(date).format("DD-MMM")
        ),
        series: [
          {
            data: Object.values(invoicesByDate),
            name: "Invoice",
          },
        ],
      },
    ];

    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getTop10DispatchItems = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10 } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };
    const dispatchInvoice = await DispatchInvoice.findAll({
      where: { ...condition },
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      offset: (pageIndex - 1) * pageSize,
      attributes: [
        "dispatch_invoice_id",
        "invoice_no",
        "invoice_date",
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
            "customer_code",
            "name",
            "mobile",
          ],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      data: {
        dispatchList: dispatchInvoice,
        chartData: req.chartData,
        statisticData: req.statisticData,
        pos: req.POs,
        customer: req.customer,
      },
    });
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const statisticData = async (req, res, next) => {
  try {
    const startOfLast15Days = dayjs().subtract(30, "days").startOf("day");
    const condition = {
      [Op.and]: [
        { deleted: false },
        {
          createdAt: {
            [Op.gte]: startOfLast15Days.toDate(),
          },
        },
      ],
    };
    const TotalInvoice = await DispatchInvoice.count({
      where: {
        ...condition,
      },
    });

    const ForeignInvoice = await DispatchInvoice.count({
      where: {
        ...condition,
        invoice_type: "foreign",
      },
    });
    const DomesticInvoice = await DispatchInvoice.count({
      where: {
        ...condition,
        invoice_type: "domestic",
      },
    });

    // console.log("TotalInvoice", TotalInvoice);

    req.statisticData = {
      totalInvoice: TotalInvoice,
      foreignInvoice: ForeignInvoice,
      domesticInvoice: DomesticInvoice,
    };
    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

// const Orders = async (req, res, next) => {
//   try {
//     // const startOfLast15Days = dayjs().subtract(30, "days").startOf("day");
//     const condition = {
//       [Op.and]: [
//         { deleted: false },
//         {
//           // createdAt: {
//           //   [Op.gte]: startOfLast15Days.toDate(),
//           // },
//         },
//       ],
//     };
//     const TotalOrders = await Po.findAndCountAll({
//       where: {
//         ...condition,
//       },
//       attributes: [
//         "po_id",
//         "poa",
//         "number",
//         "status",
//         "currency_type",
//         "date",
//         "createdAt",
//         "updatedAt",
//         [
//           sequelize.literal(`
//             (SELECT ROUND(SUM(unit_price * quantity), 2)
//              FROM po_lists
//              WHERE Po.po_id = po_lists.po_id
//              GROUP BY po_lists.po_id)
//           `),
//           "Amount",
//         ],
//       ],
//       include: [
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
//     });

//     req.statisticData.TotalOrders = TotalOrders.count;
//     return next();
//   } catch (error) {
//     next(globalError(500, "Internal server error"));
//   }
// };

const Orders = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [
        { deleted: false },
        {
          // Additional conditions can be added here
        },
      ],
    };

    // Fetch total orders
    const TotalOrders = await Po.findAndCountAll({
      where: {
        ...condition,
      },
      attributes: [
        "po_id",
        "poa",
        "number",
        "status",
        "currency_type",
        "date",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(` 
            (SELECT ROUND(SUM(unit_price * quantity), 2)
             FROM po_lists 
             WHERE Po.po_id = po_lists.po_id
             GROUP BY po_lists.po_id)
          `),
          "Amount",
        ],
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
        },
      ],
    });

    // Query for today's orders
    const TodaysOrders = await Po.findAndCountAll({
      where: {
        ...condition,
        date: sequelize.where(
          sequelize.fn("DATE", sequelize.col("date")),
          "=",
          sequelize.literal("CURDATE()")
        ),
      },
      attributes: [
        "po_id",
        "poa",
        "number",
        "status",
        "currency_type",
        "date",
        "createdAt",
        "updatedAt",
        [
          sequelize.literal(` 
            (SELECT ROUND(SUM(unit_price * quantity), 2)
             FROM po_lists 
             WHERE Po.po_id = po_lists.po_id
             GROUP BY po_lists.po_id)
          `),
          "Amount",
        ],
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
        },
      ],
    });

    req.statisticData = {
      ...req.statisticData,
      TotalOrders: TotalOrders.count,
      TodaysOrders: TodaysOrders.count,
    };

    return next();
  } catch (error) {
    next(globalError(500, "Internal server erroar"));
  }
};

const Customers = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };
    const TotalCustomers = await Customer.findAll({
      where: {
        ...condition,
      },
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
    });

    if (!TotalCustomers || !Array.isArray(TotalCustomers)) {
      throw new Error(
        "Failed to fetch customers or data is not in the expected format"
      );
    }

    const countByType = {
      customer: 0,
      supplier: 0,
    };

    TotalCustomers.forEach((customer) => {
      if (countByType[customer.type] !== undefined) {
        countByType[customer.type]++;
      }
    });

    req.statisticData = {
      ...req.statisticData,
      TotalCustomers: {
        customer: countByType.customer,
        supplier: countByType.supplier,
      },
    };

    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

// const Revenue = async (req, res, next) => {
//   try {
//     const que = `
//     SELECT
//   ROUND(SUM(
//     (item_quantity * rate *
//       CASE
//         WHEN convert_rate = 0 THEN 1
//         ELSE convert_rate
//       END
//     ) +
//     IFNULL(packing_charges, 0) + (IFNULL(packing_charges, 0) * (
//       CASE
//         WHEN bill_type = 'GST' THEN c_gst + s_gst
//         WHEN bill_type = 'IGST' THEN i_gst
//         ELSE 0
//       END
//     ) / 100) +
//     ((item_quantity * rate) + IFNULL(packing_charges, 0) + (IFNULL(packing_charges, 0) * (
//       CASE
//         WHEN bill_type = 'GST' THEN c_gst + s_gst
//         WHEN bill_type = 'IGST' THEN i_gst
//         ELSE 0
//       END
//     ) / 100)) * (
//       CASE
//         WHEN bill_type = 'GST' THEN c_gst + s_gst
//         WHEN bill_type = 'IGST' THEN i_gst
//         ELSE 0
//       END
//     ) / 100 +
//     IFNULL(fright_charges, 0)
//   ), 2) AS GRANDTOTAL
// FROM
//   view_dashboard;
//   `;

//     const [results, metadata] = await sequelize.query(que);
//     req.statisticData.revenue = results[0].GRANDTOTAL;

//     return next();
//   } catch (error) {
//     next(globalError(500, "Internal server error"));
//   }
// };

//getTodaysCustomerSales also added

const Revenue = async (req, res, next) => {
  try {
    // Query for today's revenue
    const todayQue = `
      SELECT 
        ROUND(SUM(
          (item_quantity * rate * 
            CASE 
              WHEN convert_rate = 0 THEN 1
              ELSE convert_rate
            END
          ) +
          IFNULL(packing_charges, 0) + 
          (IFNULL(packing_charges, 0) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100) +
          ((item_quantity * rate) + IFNULL(packing_charges, 0) + (IFNULL(packing_charges, 0) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100)) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100 +
          IFNULL(fright_charges, 0)
        ), 2) AS todayRevenue
      FROM 
        view_dashboard
      WHERE 
        invoice_date = CURDATE();
    `;

    // Query for total revenue
    const totalQue = `
      SELECT 
        ROUND(SUM(
          (item_quantity * rate * 
            CASE 
              WHEN convert_rate = 0 THEN 1
              ELSE convert_rate
            END
          ) +
          IFNULL(packing_charges, 0) + 
          (IFNULL(packing_charges, 0) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100) +
          ((item_quantity * rate) + IFNULL(packing_charges, 0) + (IFNULL(packing_charges, 0) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100)) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100 +
          IFNULL(fright_charges, 0)
        ), 2) AS revenue
      FROM 
        view_dashboard;
    `;

    const [todayResults] = await sequelize.query(todayQue);
    const [totalResults] = await sequelize.query(totalQue);

    // Combine results in statisticData
    req.statisticData = {
      ...req.statisticData,
      todayRevenue: todayResults[0]?.todayRevenue || 0, // Handle null
      revenue: totalResults[0]?.revenue || 0, // Handle null
    };

    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const Purchases = async (req, res, next) => {
  try {
    const startOfLast15Days = dayjs().subtract(30, "days").startOf("day");
    const condition = {
      [Op.and]: [
        { deleted: false },
        // {
        //   createdAt: {
        //     [Op.gte]: startOfLast15Days.toDate(),
        //   },
        // },
      ],
    };
    const TotalPurchases = await PurchaseOrder.count({
      where: {
        ...condition,
      },
    });

    // console.log("Total Purchases", TotalPurchases);
    req.statisticData.Purchases = TotalPurchases;

    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getTodaysInvoices = async (req, res, next) => {
  try {
    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    const condition = {
      [Op.and]: [
        { deleted: false },
        {
          createdAt: {
            [Op.between]: [todayStart, todayEnd],
          },
        },
      ],
    };

    const todaysInvoices = await DispatchInvoice.count({
      where: condition,
    });
    // console.log("todays Invoices", todaysInvoices);
    req.todaysDetails = req.todaysDetails || {};
    req.todaysDetails.invoices = todaysInvoices;

    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getTodaysCustomerSales = async (req, res, next) => {
  try {
    const que = `
      SELECT 
        customer_id,
        name AS customer_name,
        ROUND(SUM(
          (item_quantity * rate * 
            CASE 
              WHEN convert_rate = 0 THEN 1
              ELSE convert_rate
            END
          ) +
          IFNULL(packing_charges, 0) + 
          (IFNULL(packing_charges, 0) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100) +
          ((item_quantity * rate) + IFNULL(packing_charges, 0) + (IFNULL(packing_charges, 0) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100)) * (
            CASE 
              WHEN bill_type = 'GST' THEN c_gst + s_gst
              WHEN bill_type = 'IGST' THEN i_gst
              ELSE 0
            END
          ) / 100 +
          IFNULL(fright_charges, 0)
        ), 2) AS total_value,
        ROUND(SUM(item_quantity), 2) AS total_quantity
      FROM 
        view_dashboard
      WHERE 
        invoice_date = CURDATE()
      GROUP BY 
        customer_id, customer_name
      ORDER BY 
        total_value DESC;
    `;

    const [results] = await sequelize.query(que);

    if (results.length === 0) {
      req.statisticData.getTodaysCustomerSales = [];
      return next();
    }

    req.statisticData.getTodaysCustomerSales = results;

    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getTodaysOrders = async (req, res, next) => {
  try {
    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    const condition = {
      [Op.and]: [
        { deleted: false },
        {
          createdAt: {
            [Op.between]: [todayStart, todayEnd],
          },
        },
      ],
    };

    const todaysOrders = await Po.count({
      where: condition,
    });

    req.todaysDetails = req.todaysDetails || {};
    req.todaysDetails.orders = todaysOrders;

    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

module.exports = {
  statisticData,
  getChartData,
  getTop10DispatchItems,
  Orders,
  pendingPOs,
  Revenue,
  Purchases,
  Customers,
  getTodaysOrders,
  getTodaysInvoices,
  getTodaysCustomerSales,
};
