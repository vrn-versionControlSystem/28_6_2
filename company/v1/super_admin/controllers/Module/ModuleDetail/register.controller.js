const globalError = require("../../../../../../errors/global.error");
const ModuleDetail = require("../../../../../../models/company.models/Module.models/moduleDetail.model");
const { sequelize } = require("../../../../../../configs/database");

const addModuleDetail = async (req, res, next) => {
  try {
    const { user_id, module_id, show_in_menu } = req.body;

    const newModuleDetail = await ModuleDetail.create({
      user_id,
      module_id,
      show_in_menu,
    });
    if (!newModuleDetail) {
      return next(globalError(500, "Something went wrong"));
    }

    return res
      .status(200)
      .json({ success: true, message: "Successfullly Added" });
  } catch (error) {
    return next(globalError(500, "Something went wrong"));
  }
};

module.exports = { addModuleDetail };
