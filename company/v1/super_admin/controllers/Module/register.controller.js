const globalError = require("../../../../../errors/global.error");
const Module = require("../../../../../models/company.models/Module.models/moduleModel.model");
const { sequelize } = require("../../../../../configs/database");

const newmoduleReg = async (req, res, next) => {
  try {
    const {
      number,
      Customer,
      date = new Date(),
      currency_type = "INR",
      Condition,
      Note,
      note = "",
    } = req.body;

    const newPo = await Module.create({
      // key: "product.dashboard",
      // path: "/product/dashboard",
      // title: "Dashboard",
      // translateKey: "nav.product.dashboard",
      // icon: "",
      // type: "item",
      // parent_id: 7,
      // key: "task",
      // path: "",
      // title: "Task",
      // translateKey: "nav.task",
      // icon: "task",
      // type: "collapse",
      parent_id: 43,
      key: "task.list",
      path: `/task/list`,
      title: "Task List",
      icon: "",
      translateKey: "nav.task.list",
      type: "item",
    });

    if (!newPo) {
      return next(globalError(500, "Something went wrong"));
    }

    return res
      .status(200)
      .json({ success: true, message: "", data: newPo.toJSON() });
  } catch (error) {
    return next(globalError(500, "Something went wrong"));
  }
};

module.exports = { newmoduleReg };
