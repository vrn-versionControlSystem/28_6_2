const {
  toUpperCase,
  toUpperCaseOrNull,
} = require("../../../../../../utils/helpers/text_checker");
const Circle = require("../../../../../../models/company.models/enquiry.models/circle.model");
const globalError = require("../../../../../../errors/global.error");

const newCircleQuotationRegistration = async (req, res, next) => {
  try {
    const {
      od,
      thickness,
      od_weight,
      row_material_rate,
      od_amount,
      cutting_mtr,
      cutting_rate,
      cutting_amount,
      total_amount,
      profit,
      each_rate,
      circle_per_kg,
      qty,
      type = "",
      enquiry_id,
      enquiry_list_id,
    } = req.body;

    if (type === "circle") {
      const circle = await Circle.create({
        od,
        thickness,
        od_weight,
        row_material_rate,
        od_amount,
        cutting_mtr,
        cutting_rate,
        cutting_amount,
        total_amount,
        profit,
        each_rate,
        circle_per_kg,
        qty,
        enquiry_id,
        enquiry_list_id,
        added_by_id: req.jwtTokenDecryptData.user["user_id"],
        added_by: req.jwtTokenDecryptData.authority[0],
      });

      if (!circle) {
        return next(globalError(401, "error creating Quotation"));
      }

      return res.status(201).json({ success: true, data: circle.toJSON(0) });
    } else return next(globalError(401, "invalid type"));
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { newCircleQuotationRegistration };
