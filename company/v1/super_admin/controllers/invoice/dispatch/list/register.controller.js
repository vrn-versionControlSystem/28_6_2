const globalError = require("../../../../../../../errors/global.error");
const DispatchItem = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const { sequelize } = require("../../../../../../../configs/database");

// const newDispatchListRegistration = async (req, res, next) => {
//   const t = req.t;
//   try {
//     const { DispatchList = [] } = req.body;

//     DispatchList.forEach((item, index) => {
//       // console.log(`Item ${index + 1}:`);
//       // console.log(item);

//       for (const key in item) {
//         if (Object.hasOwnProperty.call(item, key)) {
//           console.log(`  ${key}: ${item[key]}`);
//         }
//       }
//     });

//     const value = DispatchList.flatMap((item) => {
//       return item.poList.map((list) => {
//         const {
//           Po,
//           PoList,
//           quantity,
//           box_no,
//           weight,
//           remarks = "",
//           row_charges,
//           machining_charges,
//         } = list;

//         const { number } = Po;
//         const {
//           Product: {
//             name,
//             item_code,
//             hsn_code,
//             description,
//             unit_measurement,
//             gst_percentage,
//             pump_model,
//           },
//           project_no,
//           serial_number,
//           delivery_date,
//           po_list_id,
//           unit_price,
//         } = PoList;

//         return {
//           dispatch_invoice_id: req.dispatchInvoice.dispatch_invoice_id,
//           product_id: PoList.Product.product_id,
//           dispatch_location_id: req.dispatchLocation.find(
//             (obj) => obj["location_code"] === (item.location_code || null)
//           ).dispatch_location_id,
//           po_id: Po.po_id,
//           project_no,
//           serial_number,
//           number,
//           delivery_date,
//           po_list_id,
//           dispatch_box_id:
//             req?.dispatchBox?.find((obj) => obj["box_no"] === parseInt(box_no))
//               ?.dispatch_box_list_id || null,
//           item_quantity: quantity,
//           item_weight: weight ? weight : 0,
//           item_name: name,
//           item_code,
//           pump_model,
//           unit_measurement,
//           hsn_code,
//           description,
//           gst_percentage,
//           rate: unit_price,
//           remarks,
//           row_charges: row_charges || 0, // Store row_charges
//           machining_charges: machining_charges || 0,
//         };
//       });
//     });

//     const newDispatchItems = await DispatchItem.bulkCreate(value, {
//       returning: true,
//       transaction: t,
//     });

//     if (newDispatchItems.length === 0) {
//       await t.rollback();
//       return next(globalError(500, "Something went wrong"));
//     }

//     const poGroupMap = new Map();

//     DispatchList.forEach((item) => {
//       item.poList.forEach((list) => {
//         const po_id = list.Po.po_id;
//         const dispatchedQty = parseFloat(list.quantity);
//         const orderedQty = parseFloat(list.PoList.quantity);

//         if (!poGroupMap.has(po_id)) {
//           poGroupMap.set(po_id, {
//             totalDispatched: 0,
//             totalOrdered: 0,
//           });
//         }

//         const current = poGroupMap.get(po_id);
//         current.totalDispatched += dispatchedQty;
//         current.totalOrdered += orderedQty;
//       });
//     });

//     return next();
//   } catch (error) {
//     await t.rollback();
//     console.log("Error", error);
//     return next(globalError(500, error.message));
//   }
// };

const newDispatchListRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    const { DispatchList = [] } = req.body;

    // Step 1: Calculate total dispatched and ordered quantities per po_id
    const poGroupMap = new Map();

    for (const item of DispatchList) {
      for (const list of item.poList) {
        const { quantity } = list;
        const { quantity: orderedQty, po_list_id } = list.PoList;
        const po_id = list.Po.po_id;

        if (!poGroupMap.has(po_id)) {
          poGroupMap.set(po_id, {
            totalDispatched: 0,
            totalOrdered: 0,
          });
        }

        const current = poGroupMap.get(po_id);
        current.totalDispatched += Number(quantity || 0);
        current.totalOrdered += Number(orderedQty || 0);
      }
    }

    // Step 2: Prepare data for insertion into DispatchItem
    const value = DispatchList.flatMap((item) => {
      return item.poList.map((list) => {
        const {
          Po,
          PoList,
          quantity,
          box_no,
          weight,
          remarks = "",
          row_charges,
          machining_charges,
        } = list;

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

        return {
          dispatch_invoice_id: req.dispatchInvoice.dispatch_invoice_id,
          product_id: PoList.Product.product_id,
          dispatch_location_id: req.dispatchLocation.find(
            (obj) => obj["location_code"] === (item.location_code || null)
          ).dispatch_location_id,
          po_id: Po.po_id,
          project_no,
          serial_number,
          number,
          delivery_date,
          po_list_id,
          dispatch_box_id:
            req?.dispatchBox?.find((obj) => obj["box_no"] === parseInt(box_no))
              ?.dispatch_box_list_id || null,
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
          row_charges: row_charges || 0,
          machining_charges: machining_charges || 0,
        };
      });
    });

    // Step 3: Create DispatchItems
    const newDispatchItems = await DispatchItem.bulkCreate(value, {
      returning: true,
      transaction: t,
    });

    if (newDispatchItems.length === 0) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }

    // console.log("po id", po_id);
    // Step 4: Update PO status where dispatched == ordered
    for (const [po_id, group] of poGroupMap.entries()) {
      if (group.totalDispatched === group.totalOrdered) {
        await sequelize.query(
          `UPDATE pos SET status = :newStatus, updatedAt = NOW() WHERE po_id = :po_id`,
          {
            replacements: {
              newStatus: "delivered",
              po_id: po_id,
            },
            transaction: t,
          }
        );
      }
    }

    return next();
  } catch (error) {
    await t.rollback();
    console.log("Error", error);
    return next(globalError(500, error.message));
  }
};

module.exports = { newDispatchListRegistration };
