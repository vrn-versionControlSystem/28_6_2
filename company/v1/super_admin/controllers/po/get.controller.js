const { Op } = require("sequelize");
const Po = require("../../../../../models/company.models/po_and_poList.models/po.model");
const PoList = require("../../../../../models/company.models/po_and_poList.models/po_list.model");
const MasterProductPlanner = require("../../../../../models/company.models/po_and_poList.models/materProductPlanerView.model");
const Product = require("../../../../../models/company.models/product.models/product.model");
const Conditions = require("../../../../../models/company.models/note.models/condition.model");
const Note = require("../../../../../models/company.models/note.models/notes.model");
const globalError = require("../../../../../errors/global.error");
const MaterialGrade = require("../../../../../models/company.models/product.models/material_grade.model");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");
const CustomerPermanentAddress = require("../../../../../models/company.models/customer.models/customer_permanent_address.model");
const Drawing = require("../../../../../models/company.models/product.models/drawing.model");
const DispatchList = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const dayjs = require("dayjs");
const { sequelize } = require("../../../../../configs/database");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");

// const getAllPoWithPagination = async (req, res, next) => {
//   try {
//     const {
//       pageIndex = 1,
//       pageSize = 10,
//       query = "",
//       poNumber = "",
//       poaNumber = "",
//       startDate = "",
//       endDate = "",
//       months = "",
//       year = "",
//       date = "",
//     } = req.body;

//     const condition = {
//       [Op.and]: [{ deleted: false }],
//     };

//     if (query) {
//       condition[Op.and].push({
//         [Op.or]: [
//           {
//             number: {
//               [Op.eq]: trimSpace(query),
//             },
//           },
//         ],
//       });
//     }
//     if (poNumber && JSON.parse(poNumber).length > 0) {
//       condition[Op.and].push({
//         number: {
//           [Op.in]: JSON.parse(poNumber),
//         },
//       });
//     }
//     if (year && JSON.parse(year).length > 0) {
//       const years = JSON.parse(year);
//       condition[Op.and].push({
//         [Op.and]: sequelize.literal(`YEAR(date) IN (${years})`),
//       });
//     }
//     if (poaNumber && JSON.parse(poaNumber).length > 0) {
//       condition[Op.and].push({
//         poa: {
//           [Op.in]: JSON.parse(poaNumber),
//         },
//       });
//     }

//     if (startDate || endDate) {
//       const formattedStartDate = dayjs(startDate)
//         .startOf("day")
//         .format("YYYY-MM-DD HH:mm:ss");
//       const formattedEndDate = dayjs(endDate)
//         .endOf("day")
//         .format("YYYY-MM-DD HH:mm:ss");

//       condition[Op.and].push({
//         [Op.and]: [
//           {
//             createdAt: {
//               [Op.between]: [formattedStartDate, formattedEndDate],
//             },
//           },
//         ],
//       });
//     }

//     if (months && JSON.parse(months).length > 0) {
//       const monthNames = JSON.parse(months);

//       const monthNumbers = monthNames.map((name) => {
//         return new Date(`${name} 1, 2000`).getMonth() + 1;
//       });

//       condition[Op.and].push({
//         [Op.and]: sequelize.literal(`MONTH(date) IN (${monthNumbers})`),
//       });
//     }
//     if (date && JSON.parse(date).length > 0) {
//       const dates = JSON.parse(date);

//       const formattedDates = dates.map((d) => `'${d}'`).join(", ");

//       condition[Op.and].push({
//         [Op.and]: sequelize.literal(`date IN (${formattedDates})`),
//       });
//     }

//     const po = await Po.findAndCountAll({
//       where: { ...condition },
//       limit: pageSize,
//       offset: (pageIndex - 1) * pageSize,
//       distinct: true,
//       order: [["createdAt", "DESC"]],
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
//       order: [["createdAt", "DESC"]],
//       // logging: console.log,
//     });
//     if (po.count === 0) {
//       return res
//         .status(200)
//         .json({ success: true, total: 0, data: [], message: "No Po Found" });
//     }
//     return res
//       .status(200)
//       .json({ success: true, total: po.count, data: po.rows });
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

// const getAllPoWithPagination = async (req, res, next) => {
//   try {
//     const {
//       pageIndex = 1,
//       pageSize = 10,
//       query = "",
//       poNumber = "",
//       poaNumber = "",
//       startDate = "",
//       endDate = "",
//       months = "",
//       year = "",
//       date = "",
//     } = req.body;

//     const condition = {
//       [Op.and]: [{ deleted: false }],
//     };

//     // Search filters
//     if (query || poNumber || poaNumber) {
//       condition[Op.and].push({
//         [Op.or]: [
//           query ? { number: { [Op.like]: `%${query}%` } } : null, // Partial match for PO Number
//           poNumber ? { number: { [Op.like]: `%${poNumber}%` } } : null, // PO Number
//           poaNumber && JSON.parse(poaNumber).length > 0
//             ? { poa: { [Op.in]: JSON.parse(poaNumber) } }
//             : null, // POA Numbers
//           query ? { "$Customer.name$": { [Op.like]: `%${query}%` } } : null, // Customer Name
//         ].filter(Boolean), // Remove null entries
//       });
//     }

//     // Filter by Year
//     if (year && JSON.parse(year).length > 0) {
//       const years = JSON.parse(year);
//       condition[Op.and].push({
//         [Op.and]: sequelize.literal(`YEAR(date) IN (${years.join(",")})`),
//       });
//     }

//     // Filter by Date Range
//     if (startDate || endDate) {
//       const formattedStartDate = dayjs(startDate).startOf("day").toDate();
//       const formattedEndDate = dayjs(endDate).endOf("day").toDate();

//       condition[Op.and].push({
//         createdAt: {
//           [Op.between]: [formattedStartDate, formattedEndDate],
//         },
//       });
//     }

//     // Filter by Month
//     if (months && JSON.parse(months).length > 0) {
//       const monthNames = JSON.parse(months);
//       const monthNumbers = monthNames.map(
//         (name) => new Date(`${name} 1, 2000`).getMonth() + 1
//       );

//       condition[Op.and].push({
//         [Op.and]: sequelize.literal(`MONTH(date) IN (${monthNumbers.join(",")})`),
//       });
//     }

//     // Filter by Exact Dates
//     if (date && JSON.parse(date).length > 0) {
//       const dates = JSON.parse(date);
//       const formattedDates = dates.map((d) => `'${d}'`).join(", ");

//       condition[Op.and].push({
//         [Op.and]: sequelize.literal(`date IN (${formattedDates})`),
//       });
//     }

//     // Fetch PO data
//     const po = await Po.findAndCountAll({
//       where: condition,
//       limit: pageSize,
//       offset: (pageIndex - 1) * pageSize,
//       distinct: true,
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
//           sequelize.literal(`(
//             SELECT ROUND(SUM(unit_price * quantity), 2)
//             FROM po_lists
//             WHERE Po.po_id = po_lists.po_id
//             GROUP BY po_lists.po_id
//           )`),
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
//       order: [["createdAt", "DESC"]],
//     });

//     // Response
//     if (po.count === 0) {
//       return res
//         .status(200)
//         .json({ success: true, total: 0, data: [], message: "No PO Found" });
//     }

//     return res.status(200).json({
//       success: true,
//       total: po.count,
//       data: po.rows,
//     });
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

const getAllPoWithPagination = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      query = "",
      customer_id = "",
      poNumber = "",
      poaNumber = "",
      startDate = "",
      endDate = "",
      months = "",
      year = "",
      date = "",
      status = "",
    } = req.body;

    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    // const currentYear = dayjs().year(); // Get current year

    // condition[Op.and].push({
    //   [Op.and]: [
    //     sequelize.where(
    //       sequelize.fn("YEAR", sequelize.col("Po.createdAt")),
    //       currentYear
    //     ),
    //   ],
    // });

    const customerCondition = {
      [Op.and]: [],
    };

    if (status) {
      condition[Op.and].push({ status: status });
    }

    // Unified search filter using query
    if (query) {
      condition[Op.and].push({
        [Op.or]: [
          { number: { [Op.like]: `%${query}%` } }, // Partial match for PO Number
          { poa: { [Op.like]: `%${query}%` } }, // Partial match for POA
          { "$Customer.name$": { [Op.like]: `%${query}%` } }, // Partial match for Customer Name
        ],
      });
    }
    //filter by customer
    if (customer_id && JSON.parse(customer_id).length > 0) {
      const customerIds = JSON.parse(customer_id);
      if (Array.isArray(customerIds)) {
        customerCondition[Op.and].push({
          customer_id: { [Op.in]: customerIds },
        });
      }
      const formattedCustomerIds = customerIds
        .map((id) => `'${id}'`)
        .join(", ");

      condition[Op.and].push({
        [Op.and]: sequelize.literal(
          `Po.customer_id IN (${formattedCustomerIds})`
        ),
      });
    }

    // Filter by PO Number
    if (poNumber && JSON.parse(poNumber).length > 0) {
      const poNumbers = JSON.parse(poNumber);
      condition[Op.and].push({
        number: { [Op.in]: poNumbers },
      });
    }

    // Filter by POA Number
    if (poaNumber && JSON.parse(poaNumber).length > 0) {
      const poaNumbers = JSON.parse(poaNumber);
      condition[Op.and].push({
        poa: { [Op.in]: poaNumbers },
      });
    }

    // Filter by Year
    if (year && JSON.parse(year).length > 0) {
      const years = JSON.parse(year);
      condition[Op.and].push({
        [Op.and]: sequelize.literal(`YEAR(date) IN (${years.join(",")})`),
      });
    }

    // Filter by Date Range
    if (startDate || endDate) {
      const formattedStartDate = dayjs(startDate).startOf("day").toDate();
      const formattedEndDate = dayjs(endDate).endOf("day").toDate();

      condition[Op.and].push({
        createdAt: {
          [Op.between]: [formattedStartDate, formattedEndDate],
        },
      });
    }

    // Filter by Month
    if (months && JSON.parse(months).length > 0) {
      const monthNames = JSON.parse(months);
      const monthNumbers = monthNames.map(
        (name) => new Date(`${name} 1, 2000`).getMonth() + 1
      );

      condition[Op.and].push({
        [Op.and]: sequelize.literal(
          `MONTH(date) IN (${monthNumbers.join(",")})`
        ),
      });
    }

    // Filter by Exact Dates
    if (date && JSON.parse(date).length > 0) {
      const dates = JSON.parse(date);
      const formattedDates = dates.map((d) => `'${d}'`).join(", ");

      condition[Op.and].push({
        [Op.and]: sequelize.literal(`date IN (${formattedDates})`),
      });
    }

    // Fetch PO data
    const po = await Po.findAndCountAll({
      where: { ...condition },
      limit: parseInt(pageSize, 10),
      offset: (parseInt(pageIndex, 10) - 1) * pageSize,
      distinct: true,
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
          sequelize.literal(`(
            SELECT ROUND(SUM(unit_price * quantity), 2)
            FROM po_lists
            WHERE Po.po_id = po_lists.po_id
            GROUP BY po_lists.po_id
          )`),
          "Amount",
        ],
      ],

      include: [
        {
          model: Customer,
          where: { ...customerCondition },
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
      order: [["createdAt", "DESC"]],
      // order: [
      //   [
      //     sequelize.literal(`
      //   CAST(
      //     SUBSTRING(poa, 5) AS UNSIGNED
      //   )
      // `),
      //     "ASC",
      //   ],
      // ],
    });

    // Response
    if (po.count === 0) {
      return res
        .status(200)
        .json({ success: true, total: 0, data: [], message: "No PO Found" });
    }

    return res.status(200).json({
      success: true,
      total: po.count,
      data: po.rows,
    });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getPoDetailsByPoId = async (req, res, next) => {
  try {
    const { po_id } = req.body;
    const query = `
    SELECT
    pos.po_id,
    pos.poa,
    pos.status,
    pos.number,
    pos.currency_type,
    pos.date,
    pos.note,
    pos.createdAt,
    pos.updatedAt,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'po_list_id', po_lists.po_list_id,
            'serial_number', po_lists.serial_number,
            'project_no', po_lists.project_no,
            'quantity', po_lists.quantity,
            'unit_price', po_lists.unit_price,
            'net_amount', po_lists.net_amount,
            'delivery_date', po_lists.delivery_date,
            'description', po_lists.description,
            'accept_description', po_lists.accept_description,
            'accept_delivery_date', po_lists.accept_delivery_date,
            'material_tc_verify_check', po_lists.material_tc_verify_check,
            'internal_inspection_check', po_lists.internal_inspection_check,
            'ndt_requirement_check', po_lists.ndt_requirement_check,
            'final_inspection_check', po_lists.final_inspection_check,
            'heat_treatment_check', po_lists.heat_treatment_check,
            'other_check', po_lists.other_check,
            'list_status', po_lists.list_status,
            'pending_quantity',mp.pending_quantity,
            'Product', JSON_OBJECT(
                'product_id', products.product_id,
                'name', products.name,
                'item_code', products.item_code,
                'product_code', products.product_code,
                'unit_measurement', products.unit_measurement,
                'standard_lead_time', products.standard_lead_time,
                'standard_lead_time_type', products.standard_lead_time_type,
                'raw_lead_time', products.raw_lead_time,
                'raw_lead_time_type', products.raw_lead_time_type,
                'machine_lead_time', products.machine_lead_time,
                'machine_lead_time_type', products.machine_lead_time_type,
                'quality_lead_time', products.quality_lead_time,
                'quality_lead_time_type', products.quality_lead_time_type,
                'drawing_number', products.drawing_number,
                'Drawings', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'raw_weight', drawings.raw_weight,
                            'finish_weight', drawings.finish_weight,
                            'revision_number',drawings.revision_number
                        )
                    )
                    FROM drawings
                    WHERE drawings.product_id = products.product_id
                )
            ),
            'Drawing', (
                    SELECT JSON_OBJECT(
                        'drawing_id', drawings.drawing_id,
                        'revision_number', drawings.revision_number
                    )
                    FROM drawings
                    WHERE drawings.drawing_id = po_lists.drawing_id
                    LIMIT 1
                )
        )
    ) AS "PoLists",

    JSON_OBJECT(
        'customer_id', customers.customer_id,
        'customer_code', customers.customer_code,
        'vender_code', customers.vender_code,
        'name', customers.name,
        'status', customers.status,
        'mobile', customers.mobile,
        'phone', customers.phone,
        'email', customers.email,
        'pan', customers.pan,
        'gst_no', customers.gst_no,
        'type', customers.type,
        'createdAt', customers.createdAt,
        'CustomerPermanentAddress', (
            SELECT
                JSON_OBJECT(
                    'address', customer_permanent_addresses.address,
                    'city', customer_permanent_addresses.city,
                    'state', customer_permanent_addresses.state,
                    'zip_code', customer_permanent_addresses.zip_code,
                    'country', customer_permanent_addresses.country,
                    'state_code',customer_permanent_addresses.state_code
                )
            FROM
                customer_permanent_addresses
            WHERE
                customer_permanent_addresses.customer_id = customers.customer_id
            LIMIT 1
        )
    ) AS "Customer",

    JSON_OBJECT(
        'condition_id', invoice_conditions.condition_id,
        'name', invoice_conditions.name,
        'condition', invoice_conditions.condition
    ) AS \`Condition\`,

    JSON_OBJECT(
        'note_id', notes.note_id,
        'name', notes.name,
        'notes', notes.notes
    ) AS Note
FROM
    pos
LEFT JOIN
    po_lists ON pos.po_id = po_lists.po_id
LEFT JOIN (
    SELECT
        po_list_id,
        pending_quantity AS pending_quantity
    FROM
        view_masterproductplaner
    GROUP BY
        po_list_id
) mp ON po_lists.po_list_id = mp.po_list_id
LEFT JOIN
    products ON po_lists.product_id = products.product_id
LEFT JOIN
    customers AS customers ON pos.customer_id = customers.customer_id
LEFT JOIN
    invoice_conditions AS invoice_conditions ON pos.condition_id = invoice_conditions.condition_id
LEFT JOIN
    notes AS notes ON pos.note_id = notes.note_id
WHERE
    pos.po_id = :po_id AND pos.deleted = 0 
GROUP BY
    pos.po_id;
`;

    const [result] = await sequelize.query(query, {
      replacements: {
        po_id: po_id,
      },
    });

    let data = result[0];
    if (data) {
      data = {
        ...result[0],
        PoLists:
          typeof result[0].PoLists === "string"
            ? JSON.parse(result[0].PoLists)
            : result[0].PoLists,
        Customer:
          typeof result[0].Customer === "string"
            ? JSON.parse(result[0].Customer)
            : result[0].Customer,
        Condition:
          typeof result[0].Condition === "string"
            ? JSON.parse(result[0].Condition)
            : result[0].Condition,
        Note:
          typeof result[0].Note === "string"
            ? JSON.parse(result[0].Note)
            : result[0].Note,
      };
      data.PoLists.sort(
        (a, b) => Number(a.serial_number) - Number(b.serial_number)
      );
    }
    return res.status(200).json({ success: true, data: data || {} });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

//Master PP

const getAllPoProducts = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      query = "",
      status,
      customer = "",
      project_no = "",
      po_no = "",
      po_serial_no = "",
      product = "",
      item_code = "",
      revision_no = "",
      material_grade = "",
      po_Date = "",
      po_del_Date = "",
      brother_Date = "",
      raw_date = "",
      machining_date = "",
      DeliveryStatus = "0",
    } = req.query;

    const offset = (pageIndex - 1) * pageSize;

    const whereConditions = [];
    if (DeliveryStatus === "0") {
      whereConditions.push(`pending_quantity > ${DeliveryStatus}`);
    }

    if (DeliveryStatus === "1") {
      whereConditions.push(`pending_quantity = 0 `);
    }

    if (product) {
      whereConditions.push(`product_id = '${product}'`);
    }
    if (customer) {
      whereConditions.push(`customer_id = '${customer}'`);
    }

    if (project_no) {
      whereConditions.push(`project_no = '${project_no}'`);
    }

    if (po_no) {
      whereConditions.push(`number = '${po_no}'`);
    }

    if (po_serial_no) {
      whereConditions.push(`serial_number = '${po_serial_no}'`);
    }

    if (item_code) {
      whereConditions.push(`item_code = '${item_code}'`);
    }

    if (revision_no) {
      whereConditions.push(`revision_number = '${revision_no}'`);
    }

    if (material_grade) {
      whereConditions.push(`material_grade_id = '${material_grade}'`);
    }

    if (po_Date) {
      const parsedPoDate = JSON.parse(po_Date);

      if (Array.isArray(parsedPoDate) && parsedPoDate.length > 0) {
        const formattedDates = parsedPoDate
          .map((date) => `'${dayjs(date).format("YYYY-MM-DD")}'`)
          .join(", ");
        whereConditions.push(`DATE IN (${formattedDates})`);
      }
    }

    if (po_del_Date) {
      const parsedPoDelDate = JSON.parse(po_del_Date);

      if (Array.isArray(parsedPoDelDate) && parsedPoDelDate.length > 0) {
        const formattedDates = parsedPoDelDate
          .map((date) => `'${dayjs(date).format("YYYY-MM-DD")}'`)
          .join(", ");
        whereConditions.push(`delivery_date IN (${formattedDates})`);
      }
    }

    if (raw_date) {
      whereConditions.push(
        `raw_date = '${dayjs(raw_date).format("YYYY-MM-DD")}'`
      );
    }

    if (machining_date) {
      whereConditions.push(
        `machining_date = '${dayjs(machining_date).format("YYYY-MM-DD")}'`
      );
    }

    if (brother_Date) {
      const parsedBrotherDate = JSON.parse(brother_Date);

      if (Array.isArray(parsedBrotherDate) && parsedBrotherDate.length > 0) {
        const formattedDates = parsedBrotherDate
          .map((date) => `'${dayjs(date).format("YYYY-MM-DD")}'`)
          .join(", ");
        whereConditions.push(`accept_delivery_date IN (${formattedDates})`);
      }
    }

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    const que = `
  SELECT * FROM view_masterproductplaner
  ${whereClause}
   ORDER BY CAST(serial_number AS UNSIGNED) ASC, DATE DESC
  LIMIT ${pageSize} OFFSET ${offset};
`;

    const que1 = `
  SELECT COUNT(*) AS count FROM view_masterproductplaner ${whereClause};
`;

    const [results, metadata] = await sequelize.query(que);
    const [results1, metadata1] = await sequelize.query(que1);

    return res
      .status(200)
      .json({ success: true, data: results, total: results1[0].count });
  } catch (error) {
    // console.log("error", error);
    next(globalError(500, error.message));
  }
};

const getAllPosByCustomerId = async (req, res, next) => {
  try {
    let { currency_type, status = "processing", customer_id } = req.body;

    if (!currency_type || currency_type.trim() === "") {
      currency_type = null;
    }

    const query = `
    SELECT
    pos.po_id,
    pos.poa,
    pos.number,
    pos.currency_type,
    pos.date,
    pos.status,
    pos.createdAt,
    (
    SELECT JSON_ARRAYAGG(po_list_data)
    FROM (
        SELECT JSON_OBJECT(
            'po_list_id', po_lists.po_list_id,
            'serial_number', po_lists.serial_number,
            'project_no', po_lists.project_no,
            'quantity', view_masterproductplaner.pending_quantity,
            'unit_price', po_lists.unit_price,
            'delivery_date', po_lists.delivery_date,
            'accept_delivery_date', po_lists.accept_delivery_date,
            'Product', JSON_OBJECT(
                'product_id', products.product_id,
                'name', products.name,
                'item_code', products.item_code,
                'product_code', products.product_code,
                'unit_measurement', products.unit_measurement,
                'hsn_code', products.hsn_code,
                'Drawings', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'raw_weight', drawings.raw_weight,
                            'finish_weight', drawings.finish_weight
                        )
                    )
                    FROM drawings
                    WHERE drawings.product_id = products.product_id
                )
            )
        ) AS po_list_data
        FROM po_lists
        LEFT JOIN (
          SELECT po_list_id, SUM(pending_quantity) AS pending_quantity
          FROM view_masterproductplaner
          WHERE pending_quantity > 0
          GROUP BY po_list_id
        ) AS view_masterproductplaner 
            ON po_lists.po_list_id = view_masterproductplaner.po_list_id
        LEFT JOIN products 
            ON po_lists.product_id = products.product_id
        WHERE po_lists.po_id = pos.po_id AND po_lists.list_status = 'accepted'
        ORDER BY po_lists.serial_number ASC
    ) AS sorted_po_lists
  ) AS "PoLists"
FROM
    pos
WHERE 
    pos.deleted = 0 
    AND pos.status = :status 
    AND pos.customer_id = :customer_id 
    AND (:currency_type IS NULL OR pos.currency_type = :currency_type)
ORDER BY 
    pos.createdAt DESC;

 `;

    const [result] = await sequelize.query(query, {
      replacements: {
        customer_id,
        status,
        currency_type,
      },
    });
    const data = result.map((list) => {
      let poLists = list.PoLists;
      if (typeof poLists === "string") {
        poLists = JSON.parse(poLists);
      }
      return {
        ...list,
        PoLists: poLists,
      };
    });
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.log("error", error);
    next(globalError(500, "Internal server error"));
  }
};

const latest10Pos = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const po = await Po.findAll({
      where: { ...condition },
      limit: 10,
      order: [["createdAt", "DESC"]],
      attributes: [
        "po_id",
        "poa",
        "number",
        "currency_type",
        "date",
        "status",
        "createdAt",
      ],
    });

    req.POs = po;
    return next();
  } catch (error) {
    next(globalError(500, "Internal server error"));
  }
};

const getAllPoNumberASOption = async (req, res, next) => {
  try {
    const { year = "", months = "", date = "", customer_id = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    if (customer_id && JSON.parse(customer_id).length > 0) {
      const customerIds = JSON.parse(customer_id);
      const formattedCustomerIds = customerIds
        .map((id) => `'${id}'`)
        .join(", ");
      condition[Op.and].push({
        [Op.and]: sequelize.literal(`customer_id IN (${formattedCustomerIds})`),
      });
    }

    if (year && JSON.parse(year).length > 0) {
      const years = JSON.parse(year);
      condition[Op.and].push({
        [Op.and]: sequelize.literal(`YEAR(date) IN (${years})`),
      });
    }

    if (months && JSON.parse(months).length > 0) {
      const monthNames = JSON.parse(months);

      const monthNumbers = monthNames.map((name) => {
        return new Date(`${name} 1, 2000`).getMonth() + 1;
      });

      condition[Op.and].push({
        [Op.and]: sequelize.literal(`MONTH(date) IN (${monthNumbers})`),
      });
    }

    if (date && JSON.parse(date).length > 0) {
      const dates = JSON.parse(date);

      const formattedDates = dates.map((d) => `'${d}'`).join(", ");

      condition[Op.and].push({
        [Op.and]: sequelize.literal(`date IN (${formattedDates})`),
      });
    }

    const po = await Po.findAll({
      where: { ...condition },
      order: [["createdAt", "ASC"]],
      attributes: ["po_id", "number"],
    });

    let arr = po.map((m) => {
      return { label: m.number, value: m.number };
    });

    res.status(200).json({ success: true, data: arr });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllPOAASOption = async (req, res, next) => {
  try {
    const { year = "", months = "", date = "", customer_id = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    if (year && JSON.parse(year).length > 0) {
      const years = JSON.parse(year);
      condition[Op.and].push({
        [Op.and]: sequelize.literal(`YEAR(date) IN (${years})`),
      });
    }

    if (months && JSON.parse(months).length > 0) {
      const monthNames = JSON.parse(months);

      const monthNumbers = monthNames.map((name) => {
        return new Date(`${name} 1, 2000`).getMonth() + 1;
      });

      condition[Op.and].push({
        [Op.and]: sequelize.literal(`MONTH(date) IN (${monthNumbers})`),
      });
    }
    if (date && JSON.parse(date).length > 0) {
      const dates = JSON.parse(date);

      const formattedDates = dates.map((d) => `'${d}'`).join(", ");

      condition[Op.and].push({
        [Op.and]: sequelize.literal(`date IN (${formattedDates})`),
      });
    }

    if (customer_id && JSON.parse(customer_id).length > 0) {
      const customerIds = JSON.parse(customer_id);
      const formattedCustomerIds = customerIds
        .map((id) => `'${id}'`)
        .join(", ");
      condition[Op.and].push({
        [Op.and]: sequelize.literal(`customer_id IN (${formattedCustomerIds})`),
      });
    }

    const po = await Po.findAll({
      where: { ...condition },
      order: [["createdAt", "ASC"]],
      attributes: ["po_id", "poa"],
    });

    let arr = po.map((m) => {
      return { label: m.poa, value: m.poa };
    });

    res.status(200).json({ success: true, data: arr });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllPoNumberByCustomerId = async (req, res, next) => {
  try {
    const { customer_id = "", DeliveryStatus = "0" } = req.body;
    let que = `
    SELECT DISTINCT(number) FROM view_masterproductplaner
    WHERE 1 ${customer_id ? " AND customer_id = :customer_id" : " "}
    AND pending_quantity ${DeliveryStatus === "0" ? "> 0" : "= 0"}  
`; //earlier it was "= :DeliveryStatus"

    let replacements = { customer_id };

    // if (DeliveryStatus !== "0") {
    //   replacements.DeliveryStatus = DeliveryStatus;
    // }

    const result = await sequelize.query(que, {
      replacements: replacements,
    });
    const uniqueNumbers = Array.from(
      new Set(result.flat().map((item) => item.number))
    );

    if (uniqueNumbers.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const data = [
      { label: "All Po Number", value: "" },
      ...uniqueNumbers.map((num) => ({ label: num, value: num })),
    ];
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getUniquePONumber = async (req, res, next) => {
  try {
    const Prefix = "BI/PO/";
    const baseNumber = 1;

    // Get the maximum number in the PO table that matches the prefix
    const max = await Po.max("number", {
      where: {
        number: {
          [Op.like]: `${Prefix}%`,
        },
      },
    });

    // Calculate the next number
    let nextNumber = baseNumber;
    if (max) {
      const parts = max.split("/");
      nextNumber = parseInt(parts[2], 10) + 1;
    }

    // Format the next number with leading zeros
    const formattedNextNumber = nextNumber.toString().padStart(3, "0");
    const next = `${Prefix}${formattedNextNumber}`;

    return res.status(200).json({ success: true, data: next });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

//Get All PO Dates from PO Table
const getPODates = async (req, res, next) => {
  try {
    let { number, DeliveryStatus = "0", customer_id } = req.body;
    let numberFilter = number && number != "  " ? " AND number= :number " : "";
    let customerFilter =
      customer_id && customer_id != "  "
        ? " AND customer_id= :customer_id "
        : "";
    let que = `
    SELECT DATE FROM view_masterproductplaner
    WHERE 1  ${numberFilter} ${customerFilter}
    AND pending_quantity ${DeliveryStatus === "0" ? "> 0" : "= 0"}
ORDER BY DATE ASC
`;
    number = number && number != "  " ? number : "";
    customer_id = customer_id && customer_id != "  " ? customer_id : "";
    let replacements = { number, customer_id };

    // if (DeliveryStatus !== "0") {
    //   replacements.DeliveryStatus = DeliveryStatus;
    // }

    const result = await sequelize.query(que, {
      replacements: replacements,
    });
    const uniqueNumbers = Array.from(
      new Set(result.flat().map((item) => item.DATE))
    );
    if (uniqueNumbers.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const data = [...uniqueNumbers.map((num) => ({ label: num, value: num }))];

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const geAllPoDeliveryDates = async (req, res, next) => {
  try {
    let { number, DeliveryStatus = "0", customer_id } = req.body;
    let numberFilter = number && number != "  " ? " AND number= :number " : "";
    let customerFilter =
      customer_id && customer_id != "  "
        ? " AND customer_id= :customer_id "
        : "";
    let que = `
    SELECT delivery_date FROM view_masterproductplaner
    WHERE 1 ${numberFilter} ${customerFilter}
    AND pending_quantity ${DeliveryStatus === "0" ? "> 0" : "= 0"}
    ORDER BY delivery_date ASC
`;
    number = number && number != "  " ? number : "";
    customer_id = customer_id && customer_id != "  " ? customer_id : "";
    let replacements = { number, customer_id };

    // if (DeliveryStatus !== "0") {
    //   replacements.DeliveryStatus = DeliveryStatus;
    // }

    const result = await sequelize.query(que, {
      replacements: replacements,
    });
    const uniqueNumbers = Array.from(
      new Set(result.flat().map((item) => item.delivery_date))
    );
    if (uniqueNumbers.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const data = [...uniqueNumbers.map((num) => ({ label: num, value: num }))];

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const geAllBrotherConfirmDate = async (req, res, next) => {
  try {
    let { number, DeliveryStatus = "0", customer_id } = req.body;
    let numberFilter = number && number != "  " ? " AND number= :number " : "";
    let customerFilter =
      customer_id && customer_id != "  "
        ? " AND customer_id= :customer_id "
        : "";
    let que = `
        SELECT accept_delivery_date FROM view_masterproductplaner
        WHERE 1 ${numberFilter} ${customerFilter}
        AND pending_quantity ${DeliveryStatus === "0" ? "> 0" : "= 0"}
        AND accept_delivery_date IS NOT NULL
        AND accept_delivery_date > '1000-01-01'
        ORDER BY accept_delivery_date ASC
    `;
    number = number && number != "  " ? number : "";
    customer_id = customer_id && customer_id != "  " ? customer_id : "";
    let replacements = { number, customer_id };

    // if (DeliveryStatus !== "0") {
    //   replacements.DeliveryStatus = DeliveryStatus;
    // }

    const result = await sequelize.query(que, {
      replacements: replacements,
    });
    const uniqueNumbers = Array.from(
      new Set(result.flat().map((item) => item.accept_delivery_date))
    );
    if (uniqueNumbers.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const data = [...uniqueNumbers.map((num) => ({ label: num, value: num }))];

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.log("error", error);
    return next(globalError(500, error.message));
  }
};

const geAllRawDate = async (req, res, next) => {
  try {
    const { customer_id = "" } = req.body;
    // let condition = {};

    // if (customer_id) {
    //   condition = {
    //     [Op.and]: [{ customer_id: customer_id }],
    //   };
    // }

    const orders = await DispatchList.findAll({
      attributes: ["raw_date"],
      // where: condition,
    });

    const dates = orders.filter((order) => order.raw_date !== null);

    // Get unique dates
    const uniqueDates = [...new Set(dates)];

    // Map unique dates to the desired format
    const arr = uniqueDates.map((date) => {
      return { label: date?.raw_date, value: date?.raw_date };
    });

    // Add the "All" option at the beginning
    arr.unshift({ label: "All Raw Dates", value: "" });

    return res.status(200).json({ success: true, data: arr });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const geAllMachiningDate = async (req, res, next) => {
  try {
    const { customer_id = "" } = req.body;
    // let condition = {};

    // if (customer_id) {
    //   condition = {
    //     [Op.and]: [{ customer_id: customer_id }],
    //   };
    // }

    const orders = await DispatchList.findAll({
      attributes: ["machining_date"],
      // where: condition,
    });

    const dates = orders.filter((order) => order.machining_date !== null);

    // Get unique dates
    const uniqueDates = [...new Set(dates)];

    // Map unique dates to the desired format
    const arr = uniqueDates.map((date) => {
      return { label: date?.machining_date, value: date?.machining_date };
    });

    // Add the "All" option at the beginning
    arr.unshift({ label: "All Machining Date", value: "" });

    return res.status(200).json({ success: true, data: arr });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getUniquePOYears = async (req, res, next) => {
  try {
    const que = `
          SELECT DISTINCT YEAR(date) AS year
FROM pos
ORDER BY year ASC;             
      `;

    const [results, metadata] = await sequelize.query(que);

    if (results[0].length === 0) {
      res.status(200).json({
        success: true,
        data: results[0],
        message: "No PO Has Been Created",
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

const getUniquePOMonths = async (req, res, next) => {
  try {
    const { year = "" } = req.body;
    let yearCondition = "";

    if (year && JSON.parse(year).length > 0) {
      let years = JSON.parse(year);
      yearCondition = ` AND YEAR(date) IN (${years.join(",")}) `;
    }

    const que = `
       SELECT 
           DISTINCT(DATE_FORMAT(date, '%b')) AS MONTH_NAME,
           MONTH(date) AS MONTH_NUMBER
       FROM
           pos
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

const getUniquePODateFromYearAndMonth = async (req, res, next) => {
  try {
    const { year = "", months = "", customer_id = "" } = req.body;

    let yearCondition = "";
    let monthCondition = "";
    let customerCondition = "";

    if (year && JSON.parse(year).length > 0) {
      let years = JSON.parse(year);
      yearCondition = ` AND YEAR(date) IN (${years.join(",")}) `;
    }
    if (months && JSON.parse(months).length > 0) {
      const monthNames = JSON.parse(months);

      const monthNumbers = monthNames.map((name) => {
        return new Date(`${name} 1, 2000`).getMonth() + 1;
      });

      monthCondition = ` AND MONTH(date) IN (${monthNumbers})`;
    }

    if (customer_id && JSON.parse(customer_id).length > 0) {
      const customers = JSON.parse(customer_id);
      customerCondition = ` AND customer_id IN (${customers
        .map((id) => `'${id}'`)
        .join(",")}) `;
    }

    const que = `
          SELECT DISTINCT(date)
FROM pos
WHERE 1 ${yearCondition} ${monthCondition} ${customerCondition}
ORDER BY date ASC;             
      `;

    const [results, metadata] = await sequelize.query(que);

    if (results[0].length === 0) {
      res.status(200).json({
        success: true,
        data: results[0],
        message: "No PO Has Been Created",
      });
    }

    const data = results.map((dat) => {
      return { label: dat.date, value: dat.date };
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getAllPoWithPagination,
  getPoDetailsByPoId,
  getAllPosByCustomerId,
  latest10Pos,
  getAllPoProducts,
  getAllPoNumberASOption,
  getAllPoNumberByCustomerId,
  getUniquePONumber,
  getPODates,
  geAllPoDeliveryDates,
  geAllBrotherConfirmDate,
  geAllRawDate,
  geAllMachiningDate,
  getAllPOAASOption,
  getUniquePOYears,
  getUniquePOMonths,
  getUniquePODateFromYearAndMonth,
};
