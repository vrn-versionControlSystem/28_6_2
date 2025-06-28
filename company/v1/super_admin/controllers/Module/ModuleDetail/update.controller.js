const globalError = require("../../../../../../errors/global.error");
const ModuleDetail = require("../../../../../../models/company.models/Module.models/moduleDetail.model");
const { sequelize } = require("../../../../../../configs/database");

const updateModule = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { formList = [], user_id } = req.body;

    for (const form of formList) {
      if (form.module_detail_id) {
        update = await ModuleDetail.update(
          { show_in_menu: form.show_in_menu },
          {
            where: {
              module_detail_id: form.module_detail_id,
            },
            transaction: t,
          }
        );
        if (update[0] == 0) {
          await t.rollback();
          return next(globalError(400, "Not Updated"));
        }
      } else {
        create = await ModuleDetail.create(
          {
            module_id: form.module_id,
            show_in_menu: form.show_in_menu,
            user_id: user_id,
            is_allowed: false,
          },
          { transaction: t }
        );
        if (!create) {
          await t.rollback();
          return next(globalError(400, "Not Created"));
        }
      }
    }

    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Successfullly Added" });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, "Something went wrong"));
  }
};

module.exports = { updateModule };
