const globalError = require("../../../../../../errors/global.error");
const Pattern = require("../../../../../../models/company.models/product.models/pattern.model");
const {
  trimSpace,
  toUpperCase,
} = require("../../../../../../utils/helpers/text_checker");

const newPatternRegistration = async (req, res, next) => {
  try {
    const {
      number,
      description,
      availability = true,
      status = true,
      customer_id,
      storage_location,
    } = req.body;

    const cleanedNumber = toUpperCase(trimSpace(number));

    const existingPattern = await Pattern.findOne(
      // { deleted: false },
      {
        where: {
          number: cleanedNumber,
          deleted: false,
        },
      }
    );

    if (existingPattern) {
      return next(globalError(409, "Pattern already exist"));
    }

    const value = {
      number: toUpperCase(trimSpace(number)),
      description,
      availability,
      status,
      customer_id,
      storage_location: toUpperCase(storage_location),
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };

    const pattern = await Pattern.create(value);
    if (!pattern) {
      return next(globalError(500, "Something went wrong"));
    }
    return res
      .status(201)
      .json({ success: true, message: `Pattern successfully created` });
  } catch (error) {
    if (error?.errors.length > 0) {
      return next(globalError(409, error.errors[0].message));
    }
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = { newPatternRegistration };
