const globalError = require("../../../../../../errors/global.error");
const ModuleDetail = require("../../../../../../models/company.models/Module.models/moduleDetail.model");
const Module = require("../../../../../../models/company.models/Module.models/moduleModel.model");
const { sequelize } = require("../../../../../../configs/database");
const { Op } = require("sequelize");

const getAllModules = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, user_id = "" } = req.body;
    // const condition = {
    //   [Op.and]: [{ deleted: false }, { status: status }],
    // };

    // if (query) {
    //   condition[Op.and].push({
    //     [Op.or]: [
    //       {
    //         number: {
    //           [Op.like]: `%${query}%`,
    //         },
    //       },
    //     ],
    //   });
    // }

    const querytt = `
  SELECT 
    m.title, 
    m.module_id, 
    md.module_detail_id, 
    COALESCE(md.show_in_menu, 0) AS show_in_menu
  FROM 
    module m
  LEFT JOIN 
    module_details md 
    ON m.module_id = md.module_id 
    AND md.user_id = :userID
    ORDER BY m.sequence
`;

    //     const queryTotalCount = `
    //   SELECT COUNT(*) AS total
    //   FROM module
    // `;
    const result = await sequelize.query(querytt, {
      replacements: {
        userID: user_id,
      },
    });

    // const totalCountResult = await sequelize.query(queryTotalCount, {});
    // const totalCount = totalCountResult[0][0].total;

    return res.status(200).json({ success: true, total: 0, data: result[0] });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = { getAllModules };
