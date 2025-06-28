const { Op } = require("sequelize");
const User = require("../../../../../models/user.model");
const globalError = require("../../../../../errors/global.error");
const { sequelize } = require("../../../../../configs/database");

const testData = async (req, res, next) => {
  try {
    const { currency_type, status = "processing", customer_id } = req.body;
    const query = `
   SELECT
    pos.po_id,
    pos.poa,
    pos.number,
    pos.currency_type,
    pos.date,
    pos.status,
    pos.createdAt,
        JSON_ARRAYAGG(
            JSON_OBJECT(
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
            )
    ) AS "PoLists"
FROM
    pos
LEFT JOIN
    po_lists ON pos.po_id = po_lists.po_id AND po_lists.list_status = 'accepted'
LEFT JOIN
    view_masterproductplaner ON po_lists.po_list_id = view_masterproductplaner.po_list_id AND view_masterproductplaner.pending_quantity > 0
LEFT JOIN
    products ON po_lists.product_id = products.product_id
WHERE pos.deleted = 0 AND pos.status= :status AND pos.customer_id = :customer_id AND pos.currency_type = :currency_type
GROUP BY
    pos.po_id, pos.poa, pos.number, pos.currency_type, pos.date, pos.status, pos.createdAt;`;

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
    next(globalError(500, error.message));
  }
};

let a = `SELECT 
    pos.po_id,
    pos.poa,
    pos.status,
    pos.number,
    pos.currency_type,
    pos.date,
    pos.note,
    pos.createdAt,
    pos.updatedAt,
    -- Aggregate PO Lists
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
            'Product', JSON_OBJECT(
                'product_id', products.product_id,
                'name', products.name,
                'item_code', products.item_code,
                'product_code', products.product_code,
                'unit_measurement', products.unit_measurement,
                'standard_lead_time', products.standard_lead_time,
                'standard_lead_time_type', products.standard_lead_time_type,
                'drawing_number', products.drawing_number,
                'Drawings', JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'drawing_id', drawings.drawing_id,
                        'revision_number', drawings.revision_number
                    )
                )
            )
        )
    ) AS PoLists,
    -- Aggregate Customer
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
                customer_permanent_addresses.*
            FROM 
                customer_permanent_addresses
            WHERE 
                customer_permanent_addresses.customer_id = customers.customer_id
            LIMIT 1
        )
    ) AS Customer,
    -- Aggregate Conditions
    JSON_OBJECT(
        'condition_id', invoice_conditions.condition_id,
        'name', invoice_conditions.name,
        'condition', invoice_conditions.condition
    ) AS Conditions,
    -- Aggregate Notes
    JSON_OBJECT(
        'note_id', notes.note_id,
        'name', notes.name,
        'notes', notes.notes
    ) AS Note
FROM 
    pos AS pos
JOIN 
    po_lists AS po_lists ON pos.po_id = po_lists.po_id
LEFT JOIN 
    products AS products ON po_lists.product_id = products.product_id
LEFT JOIN 
    drawings AS drawings ON products.product_id = drawings.product_id
LEFT JOIN 
    customers AS customers ON pos.customer_id = customers.customer_id
LEFT JOIN 
    customer_permanent_addresses AS customer_permanent_addresses ON customers.customer_id = customer_permanent_addresses.customer_id
LEFT JOIN 
    invoice_conditions AS invoice_conditions ON pos.condition_id = invoice_conditions.condition_id
LEFT JOIN 
    notes AS notes ON pos.note_id = notes.note_id
WHERE 
    pos.po_id = :po_id
GROUP BY 
    pos.po_id, pos.poa, pos.status, pos.number, pos.currency_type, pos.date, pos.note, pos.createdAt, pos.updatedAt;
`;

// const testData = async (req, res, next) => {
//   try {
//     const { po_id } = req.body;
//     const query = `
//     SELECT
//     pos.po_id,
//     pos.poa,
//     pos.status,
//     pos.number,
//     pos.currency_type,
//     pos.date,
//     pos.note,
//     pos.createdAt,
//     pos.updatedAt,
//     JSON_ARRAYAGG(
//         JSON_OBJECT(
//             'po_list_id', po_lists.po_list_id,
//             'serial_number', po_lists.serial_number,
//             'project_no', po_lists.project_no,
//             'quantity', po_lists.quantity,
//             'unit_price', po_lists.unit_price,
//             'net_amount', po_lists.net_amount,
//             'delivery_date', po_lists.delivery_date,
//             'description', po_lists.description,
//             'accept_description', po_lists.accept_description,
//             'accept_delivery_date', po_lists.accept_delivery_date,
//             'material_tc_verify_check', po_lists.material_tc_verify_check,
//             'internal_inspection_check', po_lists.internal_inspection_check,
//             'ndt_requirement_check', po_lists.ndt_requirement_check,
//             'final_inspection_check', po_lists.final_inspection_check,
//             'heat_treatment_check', po_lists.heat_treatment_check,
//             'other_check', po_lists.other_check,
//             'list_status', po_lists.list_status,
//             'pending_quantity',view_masterproductplaner.pending_quantity,
//             'Product', JSON_OBJECT(
//                 'product_id', products.product_id,
//                 'name', products.name,
//                 'item_code', products.item_code,
//                 'product_code', products.product_code,
//                 'unit_measurement', products.unit_measurement,
//                 'standard_lead_time', products.standard_lead_time,
//                 'standard_lead_time_type', products.standard_lead_time_type,
//                 'drawing_number', products.drawing_number,
//                 'Drawings', (
//                     SELECT JSON_ARRAYAGG(
//                         JSON_OBJECT(
//                             'raw_weight', drawings.raw_weight,
//                             'finish_weight', drawings.finish_weight
//                         )
//                     )
//                     FROM drawings
//                     WHERE drawings.product_id = products.product_id
//                 )
//             ),
//             'Drawing', (
//                     SELECT JSON_OBJECT(
//                         'drawing_id', drawings.drawing_id,
//                         'revision_number', drawings.revision_number
//                     )
//                     FROM drawings
//                     WHERE drawings.drawing_id = po_lists.drawing_id
//                     LIMIT 1
//                 )
//         )
//     ) AS "PoLists",

//     JSON_OBJECT(
//         'customer_id', customers.customer_id,
//         'customer_code', customers.customer_code,
//         'vender_code', customers.vender_code,
//         'name', customers.name,
//         'status', customers.status,
//         'mobile', customers.mobile,
//         'phone', customers.phone,
//         'email', customers.email,
//         'pan', customers.pan,
//         'gst_no', customers.gst_no,
//         'type', customers.type,
//         'createdAt', customers.createdAt,
//         'CustomerPermanentAddress', (
//             SELECT
//                 JSON_OBJECT(
//                     'address', customer_permanent_addresses.address,
//                     'city', customer_permanent_addresses.city,
//                     'state', customer_permanent_addresses.state,
//                     'zip_code', customer_permanent_addresses.zip_code,
//                     'country', customer_permanent_addresses.country,
//                     'state_code',customer_permanent_addresses.state_code
//                 )
//             FROM
//                 customer_permanent_addresses
//             WHERE
//                 customer_permanent_addresses.customer_id = customers.customer_id
//             LIMIT 1
//         )
//     ) AS "Customer",

//     JSON_OBJECT(
//         'condition_id', invoice_conditions.condition_id,
//         'name', invoice_conditions.name,
//         'condition', invoice_conditions.condition
//     ) AS \`Condition\`,

//     JSON_OBJECT(
//         'note_id', notes.note_id,
//         'name', notes.name,
//         'notes', notes.notes
//     ) AS Note
// FROM
//     pos
// LEFT JOIN
//     po_lists ON pos.po_id = po_lists.po_id
// LEFT JOIN
//     view_masterproductplaner ON po_lists.po_list_id = view_masterproductplaner.po_list_id
// LEFT JOIN
//     products ON po_lists.product_id = products.product_id
// LEFT JOIN
//     customers AS customers ON pos.customer_id = customers.customer_id
// LEFT JOIN
//     invoice_conditions AS invoice_conditions ON pos.condition_id = invoice_conditions.condition_id
// LEFT JOIN
//     notes AS notes ON pos.note_id = notes.note_id
// WHERE
//     pos.po_id = :po_id
// GROUP BY
//     pos.po_id;
// `;

//     const [result] = await sequelize.query(query, {
//       replacements: {
//         po_id: po_id,
//       },
//     });

//     const data = {
//       ...result[0],
//       PoLists:typeof result[0].PoLists === 'string' ? JSON.parse(result[0].PoLists) : result[0].PoLists,
//       Customer:typeof result[0].Customer === 'string' ? JSON.parse(result[0].Customer) : result[0].Customer,
//       Condition:typeof result[0].Condition === 'string' ? JSON.parse(result[0].Condition) : result[0].Condition,
//       Note:typeof result[0].Note === 'string' ?  JSON.parse(result[0].Note) : result[0].Note,
//     };
//     if (data.PoLists) {
//       data.PoLists.sort(
//         (a, b) => Number(a.serial_number) - Number(b.serial_number)
//       );
//     }

//     return res.status(200).json({ success: true, data: data });
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

module.exports = { testData };
