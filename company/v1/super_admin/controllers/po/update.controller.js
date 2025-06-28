const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Po = require("../../../../../models/company.models/po_and_poList.models/po.model");
const PoList = require("../../../../../models/company.models/po_and_poList.models/po_list.model");
const dayjs = require("dayjs");

const updatePoStatusByPoId = async (req, res, next) => {
  const t = req.t;
  try {
    const { list_status = "rejected", po_id } = req.body;
    let value = {};
    const PoAcceptList = await PoList.findAll({
      where: {
        po_id,
      },
      transaction: t,
    });

    const acceptedPOs = PoAcceptList.filter(
      (list) => list.list_status === "accepted"
    );
    if (acceptedPOs.length > 0) {
      value = {
        status: "processing",
      };
    } else {
      const rejectedPo = PoAcceptList.every(
        (list) => list.list_status === "rejected"
      );
      if (rejectedPo) {
        value = {
          status: "rejected",
        };
      }
    }

    const updatedPo = await Po.update(value, {
      where: { po_id },
      transaction: t,
    });
    if (updatedPo[0] === 0) {
      await t.rollback();
      return next(globalError(404, "Po not found"));
    }
    await t.commit();
    if (list_status === "reject") {
      return res
        .status(200)
        .json({ success: true, message: "List successfully rejected" });
    }
    return res
      .status(200)
      .json({ success: true, message: "List successfully accepted" });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, "Internal server error"));
  }
};

const updatePoByPoId = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      number,
      Customer,
      date = new Date(),
      currency_type = "INR",
      po_id,
      Condition,
      Note,
      note = "",
    } = req.body;
    const value = {
      number,
      customer_id: Customer.customer_id,
      currency_type,
      condition_id: Condition.condition_id,
      note_id: Note.note_id,
      note,
      date: dayjs(date).format("YYYY-MM-DD"),
    };
    const newPo = await Po.update(value, {
      where: { po_id: po_id },
      transaction: t,
    });
    if (newPo[0] === 0) {
      await t.rollback();
      return globalError(500, "PO not Updated");
    }
    req.t = t;

    return next();
  } catch (error) {
    await t.rollback();
    return globalError(500, error.message);
  }
};

module.exports = { updatePoStatusByPoId, updatePoByPoId };
