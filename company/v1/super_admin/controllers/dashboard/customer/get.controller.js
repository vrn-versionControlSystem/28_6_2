const { Op, fn, col } = require("sequelize");
const globalError = require("../../../../../../errors/global.error");
const { sequelize } = require("../../../../../../configs/database");

const getUniqueYears = async (req, res, next) => {
  try {
    const que = `
          SELECT DISTINCT YEAR(invoice_date) AS year
FROM view_dashboard
ORDER BY year;             
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

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

// SELECT name,
//             ROUND(SUM(
//                 (item_quantity * rate *
//                     CASE
//                         WHEN convert_rate = 0 THEN 1
//                         ELSE convert_rate
//                     END
//                 ) +
//                 IFNULL(packing_charges, 0) +
//                 (IFNULL(packing_charges, 0) * (
//                     CASE
//                         WHEN bill_type = 'GST' THEN c_gst + s_gst
//                         WHEN bill_type = 'IGST' THEN i_gst
//                         ELSE 0
//                     END
//                 ) / 100) +
//                 ((item_quantity * rate) +
//                 IFNULL(packing_charges, 0) +
//                 (IFNULL(packing_charges, 0) * (
//                     CASE
//                         WHEN bill_type = 'GST' THEN c_gst + s_gst
//                         WHEN bill_type = 'IGST' THEN i_gst
//                         ELSE 0
//                     END
//                 ) / 100)) * (
//                     CASE
//                         WHEN bill_type = 'GST' THEN c_gst + s_gst
//                         WHEN bill_type = 'IGST' THEN i_gst
//                         ELSE 0
//                     END
//                 ) / 100 +
//                 IFNULL(fright_charges, 0)
//             ), 2) AS GRANDTOTAL
//         FROM
//             view_dashboard
//         WHERE 1 ${customerCondition}
//         ${yearCondition}
//          ${monthCondition}
//         GROUP BY customer_id,name
//         LIMIT :pageSize OFFSET :offset;

const getSelectedCustomerSalesData = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      query = "",
      customer_id = "[]",
      year = "[]",
      month = "",
    } = req.body;

    const offset = (pageIndex - 1) * pageSize;
    let customerCondition = "";
    let yearCondition = "";
    let monthCondition = "";
    if (customer_id) {
      const parsedCustomerIds = JSON.parse(customer_id);
      if (Array.isArray(parsedCustomerIds) && parsedCustomerIds.length > 0) {
        var formattedCustomers = parsedCustomerIds.filter((id) => id !== "");
        customerCondition =
          formattedCustomers.length > 0
            ? ` AND customer_id IN (:formattedCustomers)`
            : "";
      }
    }

    if (year) {
      const parsedyears = JSON.parse(year);
      if (Array.isArray(parsedyears) && parsedyears.length > 0) {
        var formattedYears = parsedyears.filter((yr) => yr !== "");
        yearCondition =
          formattedYears.length > 0
            ? ` AND YEAR(invoice_date) IN (:formattedYears)`
            : "";
      }
    }

    if (month) {
      const parsedmonths = JSON.parse(month);
      if (Array.isArray(parsedmonths) && parsedmonths.length > 0) {
        var formattedMonths = parsedmonths.filter((mon) => mon !== "");
        monthCondition =
          formattedMonths.length > 0
            ? ` AND MONTH(invoice_date) IN (:formattedMonths)`
            : "";
      }
    }

    const que = `
        SELECT name,
            ROUND(SUM(
                (item_quantity * rate * 
                    CASE 
                        WHEN convert_rate = 0 THEN 1
                        ELSE convert_rate
                    END
                ) +
                IFNULL(packing_charges, 0) + 
                IFNULL(fright_charges, 0)
            ), 2) AS GRANDTOTAL
        FROM 
            view_dashboard
        WHERE 1 ${customerCondition}
        ${yearCondition}
         ${monthCondition}
        GROUP BY customer_id,name
        LIMIT :pageSize OFFSET :offset;
    `;

    const [results, metadata] = await sequelize.query(que, {
      replacements: {
        formattedCustomers,
        formattedYears,
        formattedMonths,
        pageSize,
        offset,
      },
      // logging: console.log,
    });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getMonthlySalesData = async (req, res, next) => {
  try {
    const {
      customer_id = "",
      // year = "[]",
      // month = "",
    } = req.body;

    let customerCondition = "";
    if (customer_id) {
      customerCondition = " AND customer_id = :customer_id";
    }

    const que = `
       SELECT 
    DATE_FORMAT(invoice_date, '%b') AS MONTH_NAME,
    ROUND(SUM(
        (item_quantity * rate *
            CASE
                WHEN convert_rate = 0 THEN 1
                ELSE convert_rate
            END
        ) +
        IFNULL(packing_charges, 0) +
        IFNULL(fright_charges, 0)
    ), 2) AS MONTHLY_SALES
FROM
    view_dashboard
WHERE 
    invoice_date IS NOT NULL AND YEAR(invoice_date) = YEAR(CURDATE()) ${customerCondition}
GROUP BY MONTH(invoice_date), MONTH_NAME
ORDER BY MONTH(invoice_date)
    `;

    let months = [];
    let revenue = [];

    const [results, metadata] = await sequelize.query(que, {
      replacements: {
        customer_id: customer_id,
      },
    });

    results.forEach((rev) => {
      months.push(rev.MONTH_NAME.toUpperCase());
      revenue.push(rev.MONTHLY_SALES);
    });

    res.status(200).json({ success: true, data: { months, revenue } });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getYearlySalesData = async (req, res, next) => {
  try {
    const {
      customer_id = "",
      // year = "[]",
      // month = "",
    } = req.body;

    let customerCondition = "";
    if (customer_id) {
      customerCondition = " AND customer_id = :customer_id";
    }

    const que = `
       SELECT 
    DATE_FORMAT(invoice_date, '%Y') AS YEAR_NAME,
    ROUND(SUM(
        (item_quantity * rate *
            CASE
                WHEN convert_rate = 0 THEN 1
                ELSE convert_rate
            END
        ) +
        IFNULL(packing_charges, 0) +
        IFNULL(fright_charges, 0)
    ), 2) AS MONTHLY_SALES
FROM
    view_dashboard
WHERE 
    invoice_date IS NOT NULL AND YEAR(invoice_date) >= YEAR(CURDATE()) - 6 ${customerCondition}
GROUP BY YEAR(invoice_date), YEAR_NAME 
ORDER BY YEAR(invoice_date)
    `;

    let years = [];
    let revenue = [];

    const [results, metadata] = await sequelize.query(que, {
      replacements: {
        customer_id: customer_id,
      },
    });

    results.forEach((rev) => {
      years.push(rev.YEAR_NAME);
      revenue.push(rev.MONTHLY_SALES);
    });

    res.status(200).json({ success: true, data: { years, revenue } });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getSelectedCustomerSalesData,
  getUniqueYears,
  getMonthlySalesData,
  getYearlySalesData,
};
