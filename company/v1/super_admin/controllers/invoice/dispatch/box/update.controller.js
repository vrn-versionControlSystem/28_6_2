const globalError = require("../../../../../../../errors/global.error");
const DispatchBox = require("../../../../../../../models/company.models/invoice.models/dispatch_invoice.models/dispatch_box_list");

const updateBoxDetails = async (req, res, next) => {
  try {
    const {
      box_length,
      box_height,
      box_breadth,
      box_size_type,
      tare_weight,
      dispatch_box_list_id,
      box_no,
    } = req.body;
    const value = {
      box_no,
      box_length,
      box_height,
      box_breadth,
      box_size_type,
      tare_weight,
    };

    const updaDispatchBox = await DispatchBox.update(value, {
      where: {
        dispatch_box_list_id,
      },
      returning: true,
    });
    if (updaDispatchBox[0] === 0) {
      return next(globalError(500, "Box Not Updated"));
    }

    return res.status(200).json({
      success: true,
      message: "Box Updated Successfully",
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  updateBoxDetails,
};
