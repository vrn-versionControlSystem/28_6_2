const ExcelJS = require("exceljs");
const { Sequelize, Op } = require("sequelize");
const Po = require("../../../../../models/company.models/po_and_poList.models/po.model");
const Po_list = require("../../../../../models/company.models/po_and_poList.models/po_list.model");
const globalError = require("../../../../../errors/global.error");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");
const Product = require("../../../../../models/company.models/product.models/product.model");
const DispatchList = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_list.model");
const dispatch_invoice = require("../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_invoice.model");
const { sequelize } = require("../../../../../configs/database");
const fs = require("fs");
const path = require("path");
const PoList = require("../../../../../models/company.models/po_and_poList.models/po_list.model");
const { raw } = require("body-parser");
const dayjs = require("dayjs");

const getMasterProductPlannerReport = async (req, res, next) => {
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
    } = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

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

    const calculateRawPlannedDate = (
      poDate,
      rlt,
      rltType,
      mlt,
      mltType,
      qlt,
      qltType,
      label = ""
    ) => {
      // console.log("label", label);
      const convertToDays = (value, type) => {
        switch (type) {
          case "weeks":
            return value * 7;
          case "months":
            return value * 30;
          case "years":
            return value * 365;
          default:
            return value;
        }
      };

      const rltDays = convertToDays(rlt, rltType);
      const mltDays = convertToDays(mlt, mltType);
      const qltDays = convertToDays(qlt, qltType);

      let totalDays = rltDays;

      if (label.toLowerCase() === "machine") {
        totalDays += mltDays;
      } else if (label.toLowerCase() === "quality") {
        totalDays += mltDays + qltDays;
      }

      // console.log("=============================");
      // console.log("label:", label);
      // console.log("mltDays:", mltDays);
      // console.log("Total Days:", totalDays);
      // console.log("=============================");

      if (poDate) {
        const dateObj = new Date(poDate);
        if (!isNaN(dateObj)) {
          dateObj.setDate(dateObj.getDate() + totalDays);
          return dateObj.toISOString().split("T")[0];
        }
      }

      return "Invalid Date";
    };

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    let srNo = 1;
    worksheet.columns = [
      { header: "Sr NO.", key: "sr_no", width: 10 },
      { header: "Customer", key: "customer_name", width: 40 },
      { header: "Project No", key: "project_no", width: 20 },
      { header: "PO No.", key: "number", width: 30 },
      { header: "PO Sr. No.", key: "serial_number", width: 30 },
      { header: "PO Date", key: "DATE", width: 15 },
      { header: "Product", key: "product_name", width: 40 },
      { header: "Item Code", key: "item_code", width: 30 },
      { header: "Drg/Rev No.", key: "drawing_revision", width: 30 },
      { header: "Material Grade", key: "material_grade", width: 30 },
      { header: "PO Qty", key: "quantity", width: 10 },
      { header: "PO Del Date", key: "delivery_date", width: 15 },
      { header: "Brother CNF Date", key: "accept_delivery_date", width: 20 },
      { header: "Delivered QTY", key: "item_quantity", width: 15 },
      { header: "Pending Quantity", key: "pending_qty", width: 15 },
      { header: "Status", key: "list_status", width: 15 },
      { header: "Invoice No.", key: "invoice_no", width: 40 },
      { header: "Invoice Date", key: "invoice_date", width: 40 },
      { header: "Raw Planned Date", key: "raw_planned_date", width: 20 },
      { header: "Actual Raw Date", key: "actual_raw_date", width: 20 },
      { header: "M/C Planned Date", key: "machine_planned_date", width: 20 },
      { header: "M/C Achived Date", key: "actual_machine_date", width: 20 },
      { header: "Q/C Planned Date", key: "quality_planned_date", width: 20 },
      { header: "Q/C Achived Date", key: "actual_quality_date", width: 20 },
    ];

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" },
      };
      cell.font = {
        bold: true,
        color: { argb: "000000" },
        capitalize: true,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    const que = `
        SELECT * FROM view_masterproductplaner
        ${whereClause}
        ORDER BY serial_number ASC
      `;
    // console.log(que);
    const connection = await sequelize.connectionManager.getConnection();
    const stream = connection.query(que).stream();

    stream
      .on("data", (row) => {
        const isDelivered =
          row.list_status === "accepted" &&
          parseFloat(row.pending_quantity) === 0;

        const statusColor =
          {
            processing: "D3A6D6",
            pending: "FFFFCC",
            accepted: "D0F0C0",
            rejected: "F4CCCC",
          }[row.list_status] || "FFFFFF";

        const statusLabel = isDelivered
          ? "Delivered"
          : row.list_status || "Unknown";

        let newRow = worksheet.addRow({
          ...row,
          sr_no: srNo,
          invoice_no: row?.invoice_no || "Invoice Not Created Yet",
          invoice_date: row?.invoice_date || "Invoice Not Created Yet",
          drawing_revision: `${row.drawing_number}/${row.revision_number}`,
          pending_qty: `${
            parseFloat(row.quantity) - parseFloat(row.item_quantity)
          }`,
          raw_planned_date: calculateRawPlannedDate(
            row.DATE,
            row.raw_lead_time,
            row.raw_lead_time_type,
            0,
            "",
            0,
            "",
            "Raw"
          ),

          machine_planned_date: calculateRawPlannedDate(
            row.DATE,
            row.raw_lead_time,
            row.raw_lead_time_type,
            row.machine_lead_time,
            row.machine_lead_time_type,
            0,
            "",
            "Machine"
          ),

          quality_planned_date: calculateRawPlannedDate(
            row.DATE,
            row.quality_lead_time,
            row.quality_lead_time_type,
            row.machine_lead_time,
            row.machine_lead_time_type,
            row.raw_lead_time,
            row.raw_lead_time_type,
            "Quality"
          ),

          list_status: statusLabel,
        });

        newRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: statusColor },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
        });

        newRow.height = 20;
        srNo += 1;
      })
      .on("end", async () => {
        sequelize.connectionManager.releaseConnection(connection);
        try {
          // const filePath = path.join(
          //   __dirname,
          //   "../../../../../uploads/MasterPP/masterPP.xlsx"
          // );

          // await workbook.xlsx.writeFile(filePath);

          // res.status(200).json({
          //   path: "https://api-erp.brothers.net.in/api/static/MasterPP/masterPP.xlsx",
          // });
          const buffer = await workbook.xlsx.writeBuffer();

          res.setHeader(
            "Content-Disposition",
            "attachment; filename=masterPP.xlsx"
          );
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );

          res.send(buffer);
        } catch (err) {
          console.error("Error writing Excel file:", err);
          res.status(500).send("Error while saving Excel file");
        }
      })
      .on("error", (err) => {
        console.error("Error streaming data:", err);
        res.status(500).send("Error while generating Excel file");
      });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllPoExcelReport = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      query = "",
      status,
      customer_id = "",
      months = "",
      year = "",
      poNumber = "",
      poaNumber = "",
      date = "",
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
    } = req.body;

    // console.log("customer_id", customer_id);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    const whereConditions = [];

    const safeParse = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    };

    // if (DeliveryStatus === "0") {
    //   whereConditions.push(`pending_quantity > ${DeliveryStatus}`);
    // }

    // if (DeliveryStatus === "1") {
    //   whereConditions.push(`pending_quantity = 0 `);
    // }

    if (product) {
      whereConditions.push(`product_id = '${product}'`);
    }
    if (project_no) {
      whereConditions.push(`project_no = '${project_no}'`);
    }

    // if (customer_id) {
    //   // const formattedCustomerId = Array.isArray(customer_id)
    //   //   ? customer_id[0]
    //   //   : customer_id;

    //   const customerIds = JSON.parse(customer_id);
    //   if (Array.isArray(customerIds)) {
    //     whereConditions.push(`customer_id = '${customerIds}'`);
    //   }

    //   // console.log("formattedCustomerId", formattedCustomerId);
    //   // whereConditions.push(`customer_id = '${formattedCustomerId}'`);
    // }

    // if (poNumber) {
    //   const parsedPoNumber = JSON.parse(poNumber);

    //   whereConditions.push(`number = '${parsedPoNumber}'`);
    // }

    // if (poaNumber) {
    //   const parsedPoaNumber = JSON.parse(poaNumber);

    //   whereConditions.push(`poa = '${parsedPoaNumber}'`);
    // }

    // if (date) {
    //   const parsedDate = JSON.parse(date);

    //   if (Array.isArray(parsedDate) && parsedDate.length > 0) {
    //     const formattedDates = parsedDate
    //       .map((date) => `'${dayjs(date).format("YYYY-MM-DD")}'`)
    //       .join(", ");
    //     whereConditions.push(`DATE IN (${formattedDates})`);
    //   }
    // }

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

    // if (months) {
    //   const parsedMonths = JSON.parse(months); // e.g., ["Jan", "Feb"]
    //   const monthNames = {
    //     Jan: 1,
    //     Feb: 2,
    //     Mar: 3,
    //     Apr: 4,
    //     May: 5,
    //     Jun: 6,
    //     Jul: 7,
    //     Aug: 8,
    //     Sep: 9,
    //     Oct: 10,
    //     Nov: 11,
    //     Dec: 12,
    //   };

    //   const monthConditions = parsedMonths
    //     .map((month) => {
    //       const monthNumber = monthNames[month];
    //       return `MONTH(date) = ${monthNumber}`;
    //     })
    //     .join(" OR ");

    //   if (monthConditions) {
    //     whereConditions.push(`(${monthConditions})`);
    //   }
    // }

    // if (year) {
    //   const parsedYear = JSON.parse(year)[0];
    //   whereConditions.push(`YEAR(date) = ${parsedYear}`);
    // }

    const parsedCustomer = safeParse(customer_id);
    if (
      parsedCustomer &&
      Array.isArray(parsedCustomer) &&
      parsedCustomer.length > 0
    ) {
      whereConditions.push(`customer_id = '${parsedCustomer[0]}'`);
    }

    const parsedPoNumber = safeParse(poNumber);
    if (Array.isArray(parsedPoNumber) && parsedPoNumber.length > 0) {
      const escapedValues = parsedPoNumber.map((num) => `'${num}'`).join(", ");
      whereConditions.push(`number IN (${escapedValues})`);
    }

    const parsedPoaNumber = safeParse(poaNumber);
    if (Array.isArray(parsedPoaNumber) && parsedPoaNumber.length > 0) {
      const escapedValues = parsedPoaNumber.map((num) => `'${num}'`).join(", ");
      whereConditions.push(`poa IN (${escapedValues})`);
    }

    const parsedDate = safeParse(date);
    if (parsedDate && Array.isArray(parsedDate) && parsedDate.length > 0) {
      const formattedDates = parsedDate
        .map((d) => `'${dayjs(d).format("YYYY-MM-DD")}'`)
        .join(", ");
      whereConditions.push(`DATE IN (${formattedDates})`);
    }

    const parsedMonths = safeParse(months);
    if (
      parsedMonths &&
      Array.isArray(parsedMonths) &&
      parsedMonths.length > 0
    ) {
      const monthMap = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
      };
      const monthConds = parsedMonths
        .map((month) => `MONTH(date) = ${monthMap[month]}`)
        .join(" OR ");
      whereConditions.push(`(${monthConds})`);
    }

    const parsedYear = safeParse(year);
    if (parsedYear && Array.isArray(parsedYear) && parsedYear.length > 0) {
      whereConditions.push(`YEAR(date) = ${parsedYear[0]}`);
    }

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    let srNo = 1;

    worksheet.columns = [
      { header: "Sr NO.", key: "sr_no", width: 10 },
      { header: "Customer", key: "customer_name", width: 45 },
      { header: "POA Number", key: "poa", width: 20 },
      { header: "PO Number", key: "number", width: 20 },
      { header: "PO Sl. No.", key: "serial_number", width: 20 },

      { header: "PO Date", key: "date", width: 15 },
      { header: "PO Qty", key: "quantity", width: 15 },
      { header: "Pending Qty", key: "pending_quantity", width: 15 },
      { header: "Shipping line", key: "shipping_line", width: 20 },
      { header: "Reg. Date", key: "createdAt", width: 15 },
      // { header: "Drawing Number", key: "drawing_number", width: 20 },
      { header: "Part No", key: "drawing_number", width: 45 },
      { header: "Item Name", key: "item_name", width: 15 },
      { header: "Item Code", key: "item_code", width: 20 },
      // { header: "Item Description", key: "`description`", width: 20 },
      // { header: "Customer Req Date", key: "delivery_date", width: 20 },
      { header: "Invoice No.", key: "invoice_no", width: 15 },
      { header: "Invoice Date", key: "invoice_date", width: 15 },
      { header: "Dispatch Date", key: "delivery_date", width: 15 },
      { header: "Dispatch Qty", key: "item_quantity", width: 15 },
      { header: "Rate", key: "rate", width: 15 },
      // { header: "Delivery By", key: "shipping_line", width: 15 },
      { header: "Amount", key: "amount", width: 20 },
    ];
    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" },
      };
      cell.font = {
        bold: true,
        color: { argb: "000000" },
        capitalize: true,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    const que = `
        SELECT * FROM po_view ${whereClause}
        ORDER BY serial_number ASC
      `;
    // console.log(que);
    const connection = await sequelize.connectionManager.getConnection();
    const stream = connection.query(que).stream();

    stream
      .on("data", (row) => {
        let newRow = worksheet.addRow({
          ...row,
          sr_no: srNo,
          amount: row.item_quantity * row.rate,
        });

        const statusColor =
          {
            processing: "D3A6D6",
            pending: "FFFFCC",
            accepted: "D0F0C0",
            rejected: "F4CCCC",
          }[row.list_status] || "FFFFFF";

        newRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: statusColor },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
        });

        newRow.height = 20;
        srNo += 1;
      })
      .on("end", async () => {
        sequelize.connectionManager.releaseConnection(connection);
        try {
          const buffer = await workbook.xlsx.writeBuffer();

          res.setHeader(
            "Content-Disposition",
            "attachment; filename=masterPP.xlsx"
          );
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );

          res.send(buffer);
        } catch (err) {
          console.error("Error writing Excel file:", err);
          res.status(500).send("Error while saving Excel file");
        }
      })
      .on("error", (err) => {
        console.error("Error streaming data:", err);
        res.status(500).send("Error while generating Excel file");
      });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const add = async (req, res, next) => {
  try {
    // Example of a SELECT query on a view
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM view_pos_cdd LIMIT 100",
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    console.log("9898989898989898989", results);
    console.log("9898989898989898989"); // Display the rows returned from the query
    // Display the rows returned from the query
  } catch (error) {
    console.error(error);
  }
};

const getAllPoExcelReport3 = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      query = "",
      poNumber = "",
      poaNumber = "",
      startDate = "",
      endDate = "",
      months = "",
      year = "",
      date = "",
    } = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    // Dynamic conditions based on query parameters
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

    if (poNumber && JSON.parse(poNumber).length > 0) {
      condition[Op.and].push({
        number: {
          [Op.in]: JSON.parse(poNumber),
        },
      });
    }

    if (year && JSON.parse(year).length > 0) {
      const years = JSON.parse(year);
      condition[Op.and].push({
        [Op.and]: sequelize.literal(`YEAR(date) IN (${years})`),
      });
    }

    if (poaNumber && JSON.parse(poaNumber).length > 0) {
      condition[Op.and].push({
        poa: {
          [Op.in]: JSON.parse(poaNumber),
        },
      });
    }

    if (startDate || endDate) {
      const formattedStartDate = dayjs(startDate)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const formattedEndDate = dayjs(endDate)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      condition[Op.and].push({
        [Op.and]: [
          {
            createdAt: {
              [Op.between]: [formattedStartDate, formattedEndDate],
            },
          },
        ],
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

    const que = `SELECT * FROM view_masterproductplaner`;

    const connection = await sequelize.connectionManager.getConnection();
    const stream = connection.query(que).stream();

    let srNo = 1;

    // Define columns for the Excel sheet
    worksheet.columns = [
      { header: "Sr NO.", key: "sr_no", width: 10 },
      { header: "POA Number", key: "poa", width: 20 },
      { header: "PO Number", key: "number", width: 20 },
      { header: "Customer", key: "name", width: 45 },
      { header: "PO Date", key: "date", width: 15 },
      { header: "Reg. Date", key: "createdAt", width: 15 },
      { header: "PO Qty", key: "quantity", width: 15 },
      { header: "Part No", key: "part_no", width: 45 },
      { header: "Item Name", key: "item_name", width: 15 },
      { header: "Item Code", key: "item_code", width: 20 },
      { header: "Item Description", key: "delivery_date", width: 20 },
      { header: "Customer Req Date", key: "delivery_date", width: 20 },
      { header: "Invoice No.", key: "invoice_no", width: 15 },
      { header: "Invoice Date", key: "invoice_date", width: 15 },
      { header: "Dispatch Date", key: "dispatch_date", width: 15 },
      { header: "Dispatch Qty", key: "dispatch_quantity", width: 15 },
      { header: "Rate", key: "rate", width: 15 },
    ];

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" },
      };
      cell.font = {
        bold: true,
        color: { argb: "000000" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    // Loop through the results and populate the Excel sheet
    stream.on("data", (row) => {
      let newRow = worksheet.addRow({
        sr_no: srNo,
        poa: row.poa,
        number: row.number,
        createdAt: row.createdAt
          ? row.createdAt.toISOString().split("T")[0]
          : "", // Format date
        date: row.date,
        name: row.customer_name,
        quantity: row.quantity,
        invoice_no: row.invoice_no,
        invoice_date: row.invoice_date ? row.invoice_date.split("T")[0] : "", // Format date
        item_code: row.item_code,
        rate: row.rate,
        delivery_date: row.delivery_date,
      });

      newRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });

      newRow.height = 20;
      srNo += 1;
    });

    stream.on("end", async () => {
      const buffer = await workbook.xlsx.writeBuffer();
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=SaleOrderList.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(buffer);
    });

    stream.on("error", (err) => {
      console.error("Error streaming data:", err);
      res.status(500).send("Error while generating Excel file");
    });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

// const getAllPoExcelReport = async (req, res, next) => {
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

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Report");

//     const condition = {
//       [Op.and]: [{ deleted: false }],
//     };

//     if (query) {
//       condition[Op.and].push({
//         [Op.or]: [
//           {
//             number: {
//               [Op.like]: `%${query}%`,
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

//     const po = await Po.findAll({
//       where: { ...condition },
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["po_id", "poa", "number", "date", "createdAt"],
//       include: [
//         {
//           model: Customer,
//           attributes: ["name"],
//         },
//       ],
//     });

//     const po_list = await Po_list.findAll({
//       // where: { ...condition },
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["quantity",],
//       include: [
//         {
//           model: Po,
//           attributes: ["po_id"],
//         },
//       ],
//     });

//     let srNo = 1;
//     worksheet.columns = [
//       { header: "Sr NO.", key: "sr_no", width: 10 },
//       { header: "POA Number", key: "poa", width: 20 },
//       { header: "PO Number", key: "number", width: 20 },
//       { header: "Customer", key: "name", width: 45 },
//       { header: "PO Date", key: "date", width: 15 },
//       { header: "Reg. Date", key: "createdAt", width: 15 },
//       { header: "PO Qty", key: "quantity", width: 15 }
//     ];

//     worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "D3D3D3" },
//       };
//       cell.font = {
//         bold: true,
//         color: { argb: "000000" },
//         capitalize: true,
//       };
//       cell.alignment = {
//         vertical: "middle",
//         horizontal: "center",
//       };
//       cell.border = {
//         top: { style: "thin", color: { argb: "000000" } },
//         left: { style: "thin", color: { argb: "000000" } },
//         bottom: { style: "thin", color: { argb: "000000" } },
//         right: { style: "thin", color: { argb: "000000" } },
//       };
//     });
//     let addedRows = [];
//     srNo += 1;

//     po.forEach((row) => {
//       let row1 = worksheet.addRow({
//         sr_no: srNo,
//         poa: row?.poa,
//         number: row?.number,
//         createdAt: row?.createdAt,
//         date: row?.date,
//         name: row?.Customer?.name,
//       });
//       addedRows.push(row1);
//     });

//     po_list.forEach((row) => {
//       const row2 = worksheet.addRow({
//         quantity: row?.quantity,
//       });
//       addedRows.push(row2);
//     });// Track added rows

//     addedRows.forEach((row) => {
//       row.eachCell({ includeEmpty: true }, (cell) => {
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: "center",
//           wrapText: true,
//         };
//         cell.border = {
//           top: { style: "thin", color: { argb: "000000" } },
//           left: { style: "thin", color: { argb: "000000" } },
//           bottom: { style: "thin", color: { argb: "000000" } },
//           right: { style: "thin", color: { argb: "000000" } },
//         };
//       });
//       row.height = 20; // Set row height
//     });

//     // addedRows.height = 20;
//     // srNo += 1;

//     const buffer = await workbook.xlsx.writeBuffer();

//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=SaleOrderList.xlsx"
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.send(buffer);
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

// const getAllPoExcelReport = async (req, res, next) => {
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

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Report");

//     const condition = {
//       [Op.and]: [{ deleted: false }],
//     };

//     // Add filters based on request body parameters
//     if (query) {
//       condition[Op.and].push({
//         [Op.or]: [{ number: { [Op.like]: `%${query}%` } }],
//       });
//     }
//     if (poNumber && JSON.parse(poNumber).length > 0) {
//       condition[Op.and].push({
//         number: { [Op.in]: JSON.parse(poNumber) },
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
//         poa: { [Op.in]: JSON.parse(poaNumber) },
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
//         createdAt: {
//           [Op.between]: [formattedStartDate, formattedEndDate],
//         },
//       });
//     }
//     if (months && JSON.parse(months).length > 0) {
//       const monthNames = JSON.parse(months);
//       const monthNumbers = monthNames.map((name) => new Date(`${name} 1, 2000`).getMonth() + 1);
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

//     const po = await Po.findAll({
//       where: { ...condition },
//       order: [["createdAt", "DESC"]],
//       attributes: ["po_id", "poa", "number", "date", "createdAt"],
//       include: [{ model: Customer, attributes: ["name"] }],
//     });

//     const po_list = await Po_list.findAll({
//       order: [["createdAt", "DESC"]],
//       attributes: ["po_id", "quantity"],
//     });

//     // Map po_list by po_id for easier access
//     const poListMap = po_list.reduce((acc, item) => {
//       acc[item.po_id] = item.quantity || 0; // Use 0 if quantity is null/undefined
//       return acc;
//     }, {});

//     worksheet.columns = [
//       { header: "Sr NO.", key: "sr_no", width: 10 },
//       { header: "POA Number", key: "poa", width: 20 },
//       { header: "PO Number", key: "number", width: 20 },
//       { header: "Customer", key: "name", width: 45 },
//       { header: "PO Date", key: "date", width: 15 },
//       { header: "Reg. Date", key: "createdAt", width: 15 },
//       { header: "PO Qty", key: "quantity", width: 15 },
//     ];

//     worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "D3D3D3" },
//       };
//       cell.font = {
//         bold: true,
//         color: { argb: "000000" },
//         capitalize: true,
//       };
//       cell.alignment = {
//         vertical: "middle",
//         horizontal: "center",
//       };
//       cell.border = {
//         top: { style: "thin", color: { argb: "000000" } },
//         left: { style: "thin", color: { argb: "000000" } },
//         bottom: { style: "thin", color: { argb: "000000" } },
//         right: { style: "thin", color: { argb: "000000" } },
//       };
//     });

//     let srNo = 1;
//     po.forEach((row) => {
//       worksheet.addRow({
//         sr_no: srNo++,
//         poa: row.poa,
//         number: row.number,
//         createdAt: row.createdAt,
//         date: row.date,
//         name: row.Customer?.name,
//         quantity: poListMap[row.po_id] || 0, // Use the mapped quantity or 0
//       });
//     });

//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber > 1) {
//         row.eachCell({ includeEmpty: true }, (cell) => {
//           cell.alignment = {
//             vertical: "middle",
//             horizontal: "center",
//             wrapText: true,
//           };
//           cell.border = {
//             top: { style: "thin", color: { argb: "000000" } },
//             left: { style: "thin", color: { argb: "000000" } },
//             bottom: { style: "thin", color: { argb: "000000" } },
//             right: { style: "thin", color: { argb: "000000" } },
//           };
//         });
//         row.height = 20;
//       }
//     });

//     const buffer = await workbook.xlsx.writeBuffer();

//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=SaleOrderList.xlsx"
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.send(buffer);
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

// const getAllPoExcelReport = async (req, res, next) => {

//   try {
//         const {
//           pageIndex = 1,
//           pageSize = 10,
//           query = "",
//           poNumber = "",
//           poaNumber = "",
//           startDate = "",
//           endDate = "",
//           months = "",
//           year = "",
//           date = "",
//         } = req.body;

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Report");

//         const condition = {
//           [Op.and]: [{ deleted: false }],
//         };

//         if (query) {
//           condition[Op.and].push({
//             [Op.or]: [
//               {
//                 number: {
//                   [Op.like]: `%${query}%`,
//                 },
//               },
//             ],
//           });
//         }
//         if (poNumber && JSON.parse(poNumber).length > 0) {
//           condition[Op.and].push({
//             number: {
//               [Op.in]: JSON.parse(poNumber),
//             },
//           });
//         }
//         if (year && JSON.parse(year).length > 0) {
//           const years = JSON.parse(year);
//           condition[Op.and].push({
//             [Op.and]: sequelize.literal(`YEAR(date) IN (${years})`),
//           });
//         }
//         if (poaNumber && JSON.parse(poaNumber).length > 0) {
//           condition[Op.and].push({
//             poa: {
//               [Op.in]: JSON.parse(poaNumber),
//             },
//           });
//         }

//         if (startDate || endDate) {
//           const formattedStartDate = dayjs(startDate)
//             .startOf("day")
//             .format("YYYY-MM-DD HH:mm:ss");
//           const formattedEndDate = dayjs(endDate)
//             .endOf("day")
//             .format("YYYY-MM-DD HH:mm:ss");

//           condition[Op.and].push({
//             [Op.and]: [
//               {
//                 createdAt: {
//                   [Op.between]: [formattedStartDate, formattedEndDate],
//                 },
//               },
//             ],
//           });
//         }

//         if (months && JSON.parse(months).length > 0) {
//           const monthNames = JSON.parse(months);

//           const monthNumbers = monthNames.map((name) => {
//             return new Date(`${name} 1, 2000`).getMonth() + 1;
//           });

//           condition[Op.and].push({
//             [Op.and]: sequelize.literal(`MONTH(date) IN (${monthNumbers})`),
//           });
//         }
//         if (date && JSON.parse(date).length > 0) {
//           const dates = JSON.parse(date);

//           const formattedDates = dates.map((d) => `'${d}'`).join(", ");

//           condition[Op.and].push({
//             [Op.and]: sequelize.literal(`date IN (${formattedDates})`),
//           });
//         }

//         const po = await Po.findAll({
//           where: { ...condition },
//           distinct: true,
//           order: [["createdAt", "DESC"]],
//           attributes: ["po_id", "poa", "number", "date", "createdAt"],
//           include: [
//             {
//               model: Customer,
//               attributes: ["name"],
//             },
//           ],
//         });

//     // Step 1: Fetch po_list data with associated PO details
//     const po_list = await Po_list.findAll({
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["quantity"],
//       include: [
//         {
//           model: Po,
//           attributes: ["po_id", "number", "date", "createdAt"],
//           include: [{ model: Customer, attributes: ["name"] }],
//         },
//       ],
//     });

//     // Step 2: Fetch product data
//     const product = await Product.findAll({
//       where: { ...condition }, // Apply conditions if required
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["drawing_number", "item_code", "description"],
//     });

//     // Step 3: Fetch dispatch list data with associated product details
//     const dispatchList = await DispatchList.findAll({
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["number", "item_code", "createdAt", "item_name", "rate"],
//       include: [
//         {
//           model: Product,
//           attributes: ["product_id"],
//         },
//       ],
//     });

//     // Step 4: Create a new workbook and worksheet
//     // const workbook = new ExcelJS.Workbook();
//     // const worksheet = workbook.addWorksheet("PO Excel Report");

//     // Step 5: Define worksheet columns
//     worksheet.columns = [
//       { header: "Sr NO.", key: "sr_no", width: 10 },
//       { header: "POA Number", key: "poa", width: 20 },
//       { header: "PO Number", key: "number", width: 20 },
//       { header: "Customer", key: "name", width: 45 },
//       { header: "PO Date", key: "date", width: 15 },
//       { header: "Reg.Date", key: "createdAt", width: 15 },
//       { header: "PO Qty", key: "quantity", width: 15 },
//       { header: "Part No", key: "drawing_number", width: 20 },
//       { header: "Item Code", key: "item_code", width: 20 },
//       { header: "Item Description", key: "description", width: 45 },
//       { header: "Customer Req Date", key: "delivery_date", width: 20 },
//       { header: "Invoice No.", key: "number", width: 15 },
//       { header: "Invoice Date", key: "createdAt", width: 15 },
//       { header: "Dispatch Qty", key: "item_quantity", width: 15 },
//       { header: "Rate", key: "rate", width: 15 },
//     ];

//     // Step 6: Style the header row
//     worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "D3D3D3" },
//       };
//       cell.font = { bold: true, color: { argb: "000000" } };
//       cell.alignment = { vertical: "middle", horizontal: "center" };
//       cell.border = {
//         top: { style: "thin", color: { argb: "000000" } },
//         left: { style: "thin", color: { argb: "000000" } },
//         bottom: { style: "thin", color: { argb: "000000" } },
//         right: { style: "thin", color: { argb: "000000" } },
//       };
//     });

//     // Step 7: Add data rows
//     let srNo = 1;
//     const addedRows = [];

//     // Add PO data
//     po_list.forEach((row) => {
//       const row1 = worksheet.addRow({
//         sr_no: srNo++,
//         poa: row?.Po?.po_id || "",
//         number: row?.Po?.po_number || "",
//         date: row?.Po?.date || "",
//         createdAt: row?.Po?.createdAt || "",
//         name: row?.Po?.Customer?.name || "",
//         quantity: row?.quantity || "",
//       });
//       addedRows.push(row1);
//     });

//     // Add product data
//     product.forEach((row) => {
//       const row2 = worksheet.addRow({
//         drawing_number: row?.drawing_number || "",
//         item_code: row?.item_code || "",
//         description: row?.description || "",
//       });
//       addedRows.push(row2);
//     });

//     // Add dispatch list data
//     dispatchList.forEach((row) => {
//       const row3 = worksheet.addRow({
//         delivery_date: row?.delivery_date || "",
//         number: row?.number || "",
//         createdAt: row?.createdAt || "",
//         item_quantity: row?.item_quantity || "",
//         rate: row?.rate || "",
//       });
//       addedRows.push(row3);
//     });

//     // Step 8: Style added rows
//     addedRows.forEach((row) => {
//       row.eachCell({ includeEmpty: true }, (cell) => {
//         cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
//         cell.border = {
//           top: { style: "thin", color: { argb: "000000" } },
//           left: { style: "thin", color: { argb: "000000" } },
//           bottom: { style: "thin", color: { argb: "000000" } },
//           right: { style: "thin", color: { argb: "000000" } },
//         };
//       });
//       row.height = 20;
//     });

//     // Step 9: Send the Excel file
//     const buffer = await workbook.xlsx.writeBuffer();

//     res.setHeader("Content-Disposition", "attachment; filename=POExcelReport.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//     res.send(buffer);
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

////////////////latest one changes code /////////////////
// const getAllPoExcelReport = async (req, res, next) => {
//   try {
//     // Extract parameters from the request body
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

//     // Initialize condition for query filtering
//     const condition = {
//       [Op.and]: [{ deleted: false }],
//     };

//     // Apply search filters
//     if (query) {
//       condition[Op.and].push({
//         [Op.or]: [
//           {
//             number: {
//               [Op.like]: `%${query}%`,
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
//       const formattedStartDate = dayjs(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
//       const formattedEndDate = dayjs(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
//       condition[Op.and].push({
//         createdAt: {
//           [Op.between]: [formattedStartDate, formattedEndDate],
//         },
//       });
//     }
//     if (months && JSON.parse(months).length > 0) {
//       const monthNames = JSON.parse(months);
//       const monthNumbers = monthNames.map((name) => new Date(`${name} 1, 2000`).getMonth() + 1);
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

//     // Fetch data from the database
//     const po = await Po.findAll({
//       where: { ...condition },
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["po_id", "poa", "number", "date", "createdAt"],
//       include: [
//         {
//           model: Customer,
//           attributes: ["name"],
//         },
//       ],
//     });

//     const po_list = await Po_list.findAll({
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["quantity"],
//       include: [
//         {
//           model: Po,
//           attributes: ["po_id", "number", "date", "createdAt"],
//           include: [{ model: Customer, attributes: ["name"] }],
//         },
//       ],
//     });

//     const product = await Product.findAll({
//       where: { ...condition },
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["drawing_number", "item_code", "name"],
//     });

//     const dispatchList = await DispatchList.findAll({
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["number", "item_code", "createdAt", "item_name", "rate","updatedAt"],
//       include: [
//         {
//           model: Product,
//           attributes: ["product_id"],
//         },
//       ],
//     });

//     // Create an Excel workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("PO Excel Report");

//     // remaining columns LineNo,balance qty,amount,delivery by
//     worksheet.columns = [
//       { header: "Sr NO.", key: "sr_no", width: 10 },
//       { header: "POA Number", key: "poa", width: 20 },
//       { header: "PO Number", key: "number", width: 20 },
//       { header: "Customer", key: "name", width: 45 },
//       { header: "PO Date", key: "date", width: 15 },
//       { header: "Reg.Date", key: "createdAt", width: 15 },
//       { header: "PO Qty", key: "quantity", width: 15 },
//       { header: "Drawing Number", key: "drawing_number", width: 30 },
//       { header: "Item Code", key: "item_code", width: 30 },
//       { header: "Part Name", key: "name", width: 45 },
//       { header: "Customer Req Date", key: "delivery_date", width: 20 },
//       { header: "Invoice No.", key: "number", width: 15 },
//       { header: "Invoice Date", key: "createdAt", width: 15 },
//       { header: "Item Name", key: "item_name", width: 15 },
//       { header: "Dispatch Date", key: "updatedAt", width: 15 },
//       { header: "Dispatch Qty", key: "item_quantity", width: 15 },
//       { header: "Rate", key: "rate", width: 15 },
//     ];

//     // Style the header row
//     worksheet.getRow(1).eachCell((cell) => {
//       cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D3D3D3" } };
//       cell.font = { bold: true };
//       cell.alignment = { vertical: "middle", horizontal: "center" };
//     });

//      console.log("po_list",po_list);
//     // Populate the worksheet with data
//     let srNo = 1;
//     po_list.forEach((row) => {
//       worksheet.addRow({
//         sr_no: srNo++,
//         poa: row?.Po?.po_id || "",
//         number: row?.Po?.number || "",
//         date: row?.Po?.date || "",
//         createdAt: row?.Po?.createdAt || "",
//         name: row?.Po?.Customer?.name || "",
//         quantity: row?.quantity || "",
//       });
//     });

//     console.log("product",product);

//     product.forEach((row) => {
//       worksheet.addRow({
//         drawing_number: row.drawing_number,
//         item_code: row.item_code,
//         name: row.name,
//       });
//     });

//     console.log("dispatchList",dispatchList);

//     dispatchList.forEach((row) => {
//       worksheet.addRow({
//         number: row.number,
//        item_code:row.item_code,
//        createdAt: row.createdAt,
//         rate: row.rate,
//         updatedAt:row.updatedAt
//       });
//     });

//     // Send the Excel file as a response
//     const buffer = await workbook.xlsx.writeBuffer();
//     res.setHeader("Content-Disposition", "attachment; filename=POExcelReport.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//     res.send(buffer);
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

// const getAllPoExcelReport = async (req, res, next) => {
//   try {
//     // Extract parameters from the request body
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

//     // Initialize condition for query filtering
//     const condition = {
//       [Op.and]: [{ deleted: false }],
//     };

//     // Apply search filters
//     if (query) {
//       condition[Op.and].push({
//         [Op.or]: [
//           {
//             number: {
//               [Op.like]: `%${query}%`,
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
//       const formattedStartDate = dayjs(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
//       const formattedEndDate = dayjs(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
//       condition[Op.and].push({
//         createdAt: {
//           [Op.between]: [formattedStartDate, formattedEndDate],
//         },
//       });
//     }
//     if (months && JSON.parse(months).length > 0) {
//       const monthNames = JSON.parse(months);
//       const monthNumbers = monthNames.map((name) => new Date(`${name} 1, 2000`).getMonth() + 1);
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

//     // Fetch data from the database
//     const po = await Po.findAll({
//       where: { ...condition },
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["po_id", "poa", "number", "date", "createdAt"],
//       include: [
//         {
//           model: Customer,
//           attributes: ["name"],
//         },
//       ],
//     });

//     const po_list = await Po_list.findAll({
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["quantity"],
//       include: [
//         {
//           model: Po,
//           attributes: ["po_id", "number", "date", "createdAt"],
//           include: [{ model: Customer, attributes: ["name"] }],
//         },
//       ],
//     });

//     const product = await Product.findAll({
//       where: { ...condition },
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["drawing_number", "item_code", "name"],
//     });

//     const dispatchList = await DispatchList.findAll({
//       distinct: true,
//       order: [["createdAt", "DESC"]],
//       attributes: ["number", "item_code", "createdAt", "item_name", "rate","updatedAt"],
//       include: [
//         {
//           model: Product,
//           attributes: ["product_id"],
//         },
//       ],
//     });

//     // Create an Excel workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("PO Excel Report");

//     // remaining columns LineNo,balance qty,amount,delivery by
//     worksheet.columns = [
//       { header: "Sr NO.", key: "sr_no", width: 10 },
//       { header: "POA Number", key: "poa", width: 20 },
//       { header: "PO Number", key: "number", width: 20 },
//       { header: "Customer", key: "name", width: 45 },
//       { header: "PO Date", key: "date", width: 15 },
//       { header: "Reg.Date", key: "createdAt", width: 15 },
//       { header: "PO Qty", key: "quantity", width: 15 },
//       { header: "Drawing Number", key: "drawing_number", width: 30 },
//       { header: "Item Code", key: "item_code", width: 30 },
//       // { header: "Part Name", key: "name", width: 45 },
//     ];

//     // Style the header row
//     worksheet.getRow(1).eachCell((cell) => {
//       cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D3D3D3" } };
//       cell.font = { bold: true };
//       cell.alignment = { vertical: "middle", horizontal: "center" };
//     });

// let srNo = 1;

// const rows = [];

// po_list.forEach((row, index) => {
//   rows.push({
//     sr_no: index + 1,
//     poa: row?.Po?.po_id || "",
//     number: row?.Po?.number || "",
//     date: row?.Po?.date || "",
//     createdAt: row?.Po?.createdAt || "",
//     name: row?.Po?.Customer?.name || "",
//     quantity: row?.quantity || "",
//     drawing_number: "",
//     item_code: "",
//     // name: "",
//     // delivery_date: "",
//     // rate: "",
//     // updatedAt: "",
//     // item_quantity: "",
//   });
// });

// // Populate rows from product
// product.forEach((row) => {
//   rows.push({
//     sr_no: "",
//     poa: "",
//     number: "",
//     date: "",
//     createdAt: "",
//     name: "",
//     quantity: "",
//     drawing_number: row.drawing_number,
//     item_code: row.item_code,
//     // name: row.name,
//     // delivery_date: "",
//     // rate: "",
//     // updatedAt: "",
//     // item_quantity: "",
//   });
// });

// // Populate rows from dispatchList
// // dispatchList.forEach((row) => {
// //   rows.push({
// //     sr_no: "",
// //     poa: "",
// //     number: row.number,
// //     date: "",
// //     createdAt: row.createdAt,
// //     name: "",
// //     quantity: "",
// //     drawing_number: "",
// //     item_code: row.item_code,
// //     item_name: row.item_name,
// //     delivery_date: "",
// //     rate: row.rate,
// //     updatedAt: row.updatedAt,
// //     item_quantity: "",
// //   });
// // });

// // Add all rows to the worksheet
// rows.forEach((row) => {
//   console.log("Rows",row)
//   worksheet.addRow(row)
// }
// );

//     // Send the Excel file as a response
//     const buffer = await workbook.xlsx.writeBuffer();
//     res.setHeader("Content-Disposition", "attachment; filename=POExcelReport.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//     res.send(buffer);
//   } catch (error) {
//     next(globalError(500, error.message));
//   }
// };

module.exports = { getMasterProductPlannerReport, getAllPoExcelReport };
