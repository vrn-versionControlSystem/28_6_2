const dayjs = require("dayjs");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");
const globalError = require("../../../../../errors/global.error");
const Module = require("../../../../../models/company.models/Module.models/moduleModel.model");
const { sequelize } = require("../../../../../configs/database");

const getModules = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    console.log("user_id", user_id);

    const query = `
    WITH RECURSIVE menu_tree AS (
        SELECT module_id, \`key\`, path, title, translatekey, icon, type, parent_id, user_id, module_detail_id, authority, sequence
        FROM view_navigationconfig
        WHERE parent_id IS NULL AND user_id = :user_id AND show_in_menu = 1
    
        UNION ALL
    
        SELECT ni.module_id, ni.\`key\`, ni.path, ni.title, ni.translatekey, ni.icon, ni.type, ni.parent_id, ni.user_id, ni.module_detail_id, ni.authority, ni.sequence
        FROM view_navigationconfig ni
        INNER JOIN menu_tree mt ON ni.parent_id = mt.module_id
        WHERE ni.user_id = :user_id AND ni.show_in_menu = 1
    )
    SELECT * FROM menu_tree
    ORDER BY sequence;
`;

    let firstPath = "";
    const result = await sequelize.query(query, {
      replacements: { user_id: user_id },
    });

    const buildMenuTree = (menuItems, parentId = null, visited = new Set()) => {
      return menuItems
        .sort((a, b) => a.sequence - b.sequence)
        .filter(
          (item) => item.parent_id === parentId && !visited.has(item.module_id)
        )
        .map((item) => {
          visited.add(item.module_id);
          if (item.title && !firstPath) {
            firstPath = item.path;
          }
          return {
            key: item.key,
            path: item.path,
            title: item.title,
            translateKey: item.translatekey,
            icon: item.icon || "",
            type: item.type,
            authority: [item.authority],
            subMenu: buildMenuTree(menuItems, item.module_id, visited),
          };
        });
    };

    const hierarchicalMenu = buildMenuTree(result[0]);

    return res.status(200).json({
      success: true,
      message: "",
      data: { navigationRoute: hierarchicalMenu, entryPath: firstPath },
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { getModules };
