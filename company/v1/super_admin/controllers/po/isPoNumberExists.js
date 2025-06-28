const dayjs = require("dayjs");
const {
  toUpperCase,
  trimSpace,
  toUpperCaseOrNull,
} = require("../../../../../utils/helpers/text_checker");
const globalError = require("../../../../../errors/global.error");
const Po = require("../../../../../models/company.models/po_and_poList.models/po.model");

const isPoNumberExists = async (req, res, next) => {
  try {
    const { number } = req.body;

    const value = {
      number: toUpperCaseOrNull(trimSpace(number)),
    };

    console.log("value", value);

    const find = await Po.findOne({
      where: {
        number: value.number,
        deleted: false,
      },
    });

    // console.log("find", find);

    if (find) {
      return next(globalError(400, "PO Number Already Exists"));
    }
    return res.status(200).json({ success: true, message: "PO Number Unique" });
  } catch (error) {
    return next(globalError(500, "Something went wrong"));
  }
};

module.exports = { isPoNumberExists };
