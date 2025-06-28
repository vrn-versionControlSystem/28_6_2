const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");

const getAllQuality = async (req, res, next) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      customer_id = "",
      product_id = "",
    } = req.body;

    const offset = (pageIndex - 1) * pageSize;

    const whereConditions = [];

    if (customer_id) {
      whereConditions.push(`customer_id = '${customer_id}'`);
    }

    if (product_id) {
      whereConditions.push(`product_id = '${product_id}'`);
    }

    console.log("whereConditions", whereConditions);

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    console.log("whereClause", whereClause);

    const query = `
      SELECT * FROM view_qualitycontrol
      ${whereClause}
      ORDER BY CAST(serial_number AS UNSIGNED) ASC, DATE DESC
      LIMIT ${pageSize} OFFSET ${offset};
    `;

    const countQuery = `
      SELECT COUNT(*) AS count FROM view_qualitycontrol ${whereClause};
    `;

    const [results] = await sequelize.query(query);
    const [countResult] = await sequelize.query(countQuery);

    return res.status(200).json({
      success: true,
      data: results,
      total: countResult[0].count,
    });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllProductsByCustomerId = async (req, res, next) => {
  try {
    let { currency_type, status = "processing", customer_id } = req.body;

    if (!currency_type || currency_type.trim() === "") {
      currency_type = null;
    }

    const query = `
      SELECT
        (
          SELECT JSON_ARRAYAGG(product_data)
          FROM (
            SELECT JSON_OBJECT(
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
            ) AS product_data
            FROM po_lists
            LEFT JOIN products 
              ON po_lists.product_id = products.product_id
            WHERE po_lists.po_id = pos.po_id AND po_lists.list_status = 'accepted'
            GROUP BY products.product_id
          ) AS product_list
        ) AS "Products",
        JSON_OBJECT(
          'customer_id', customers.customer_id
        ) AS "Customer"
      FROM
        pos
      LEFT JOIN customers ON customers.customer_id = pos.customer_id
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

module.exports = { getAllQuality, getAllProductsByCustomerId };
