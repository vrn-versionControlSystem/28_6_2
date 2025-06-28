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

const getSelectedProductSalesData = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      query = "",
      product_id = "[]",
      year = "[]",
      month = "[]",
    } = req.body;

    const offset = (pageIndex - 1) * pageSize;
    let productCondition = "";
    let yearCondition = "";
    let monthCondition = "";
    if (product_id) {
      const parsedProductIds = JSON.parse(product_id);
      if (Array.isArray(parsedProductIds) && parsedProductIds.length > 0) {
        var formattedProducts = parsedProductIds.filter((id) => id !== "");
        productCondition =
          formattedProducts.length > 0
            ? ` AND product_id IN (:formattedProducts)`
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
        SELECT product_name,
            SUM(
                item_quantity
            ) AS TOTALQUANTITY
        FROM 
            view_masterproductplaner
        WHERE 1 ${productCondition}
        ${yearCondition}
         ${monthCondition}
        GROUP BY product_id,product_name
        LIMIT :pageSize OFFSET :offset;
    `;

    const countQuery = `
    SELECT COUNT(*) AS totalCount
    FROM (
        SELECT 1
        FROM view_masterproductplaner
        WHERE 1 ${productCondition}
        ${yearCondition}
        ${monthCondition}
        GROUP BY product_id,product_name
    ) AS subquery;
  `;

    const [results, metadata] = await sequelize.query(que, {
      replacements: {
        formattedProducts,
        formattedYears,
        formattedMonths,
        pageSize,
        offset,
      },
      // logging: console.log,
    });

    const [countResult] = await sequelize.query(countQuery);

    const totalCount = countResult[0]?.totalCount || 0;

    res.status(200).json({
      success: true,
      data: results,
      total: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getMonthlyProductData = async (req, res, next) => {
  try {
    const { product_id = "" } = req.body;

    let productCondition = "";
    if (product_id) {
      productCondition = " AND product_id = :product_id";
    }

    const que = `
       SELECT 
    DATE_FORMAT(invoice_date, '%b') AS MONTH_NAME,
    SUM(
        item_quantity
    ) AS QUANTITY_SALES
FROM
    view_masterproductplaner
WHERE 
    invoice_date IS NOT NULL AND YEAR(invoice_date) = YEAR(CURDATE()) ${productCondition}
GROUP BY MONTH(invoice_date), MONTH_NAME
ORDER BY MONTH(invoice_date)
    `;

    let months = [];
    let quantity = [];

    const [results, metadata] = await sequelize.query(que, {
      replacements: {
        product_id: product_id,
      },
    });

    results.forEach((rev) => {
      months.push(rev.MONTH_NAME.toUpperCase());
      quantity.push(rev.QUANTITY_SALES);
    });

    res.status(200).json({ success: true, data: { months, quantity } });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getProductByCategory = async (req, res, next) => {
  try {
    const que = `
       SELECT 
    COUNT(products.product_id) AS Quantity, 
    categories.name AS Category
FROM 
    categories 
LEFT JOIN 
    products 
ON 
    categories.category_id = products.category_id 
WHERE 
    products.deleted = 0 AND categories.deleted = 0
GROUP BY 
    categories.category_id; 
    `;

    const [results, metadata] = await sequelize.query(que);
    const CATEGORY = [];
    const QUANTITY = [];
    results.forEach((rev) => {
      CATEGORY.push(rev.Category);
      QUANTITY.push(rev.Quantity);
    });

    res.status(200).json({ success: true, data: { CATEGORY, QUANTITY } });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getTOPSellingProduct = async (req, res, next) => {
  try {
    const que = `
       SELECT 
    SUM(item_quantity) AS Quantity, 
    product_name
FROM 
    view_masterproductplaner
GROUP BY 
    product_id, product_name
ORDER BY 
    Quantity DESC
LIMIT 5;
 
    `;

    const [results, metadata] = await sequelize.query(que, {
      raw: true,
    });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getYearlyProductData = async (req, res, next) => {
  try {
    const { product_id = "" } = req.body;

    let productCondition = "";
    if (product_id) {
      productCondition = " AND product_id = :product_id";
    }

    const que = `
       SELECT 
    DATE_FORMAT(invoice_date, '%Y') AS YEAR_NAME,
    SUM(
    item_quantity  
    ) AS QUANTITY_SALES
FROM
    view_masterproductplaner
WHERE 
    invoice_date IS NOT NULL AND YEAR(invoice_date) >= YEAR(CURDATE()) - 6 ${productCondition}
GROUP BY YEAR(invoice_date), YEAR_NAME 
ORDER BY YEAR(invoice_date)
    `;

    let years = [];
    let quantity = [];

    const [results, metadata] = await sequelize.query(que, {
      replacements: {
        product_id: product_id,
      },
    });

    results.forEach((rev) => {
      years.push(rev.YEAR_NAME);
      quantity.push(rev.QUANTITY_SALES);
    });

    res.status(200).json({ success: true, data: { years, quantity } });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getMonthlyProductData,
  getYearlyProductData,
  getSelectedProductSalesData,
  getProductByCategory,
  getTOPSellingProduct,
};
