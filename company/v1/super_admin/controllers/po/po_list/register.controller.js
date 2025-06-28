const dayjs = require("dayjs");
const PoList = require("../../../../../../models/company.models/po_and_poList.models/po_list.model");
const globalError = require("../../../../../../errors/global.error");
const {
  toUpperCase,
  trimSpace,
} = require("../../../../../../utils/helpers/text_checker");

const newPoListRegistration = async (req, res, next) => {
  const t = req.t;
  try {
    const { items = [] } = req.body;
    const value = items.map((item) => {
      return {
        project_no: toUpperCase(trimSpace(item.project_no)),
        po_id: req.po.po_id,
        product_id: item.Product.product_id,
        serial_number: toUpperCase(trimSpace(item.serial_number)),
        drawing_id: item?.Product?.Drawings?.find(
          (obj) => obj["revision_number"] === item.revision_number
        )?.drawing_id,
        quantity: item.quantity || 0,
        unit_price: item.unit_price || 0,
        delivery_date: dayjs(item.delivery_date).format("YYYY-MM-DD"),
        description: toUpperCase(trimSpace(item.description)),
        material_tc_verify_check: item?.material_tc_verify_check
          ? item.material_tc_verify_check
          : false,
        internal_inspection_check: item?.internal_inspection_check
          ? item.internal_inspection_check
          : false,
        ndt_requirement_check: item?.ndt_requirement_check
          ? item.ndt_requirement_check
          : false,
        final_inspection_check: item?.final_inspection_check
          ? item.final_inspection_check
          : false,
        heat_treatment_check: item?.heat_treatment_check
          ? item.heat_treatment_check
          : false,
        other_check: item?.other_check ? item.other_check : false,
      };
    });
    const newPoList = await PoList.bulkCreate(value, { transaction: t });
    if (!newPoList) {
      await t.rollback();
      return next(globalError(500, "Something went wrong"));
    }
    await t.commit();
    res.status(200).json({ message: "PO successfully created" });
  } catch (error) {
    await t.rollback();
    return next(globalError(500, "Something went wrong"));
  }
};

module.exports = { newPoListRegistration };
