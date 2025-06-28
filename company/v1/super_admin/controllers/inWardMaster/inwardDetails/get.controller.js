const { Op } = require("sequelize");
// const InWardMaster = require("../../../../../models/company.models/inwardMaster.models/inwardMaster.model");
const InWardDetail = require("../../../../../../models/company.models/inwardMaster.models/inwardDetail.model");
// const Customer = require("../../../../../models/company.models/customer.models/customer.model");
// const Product = require("../../../../../models/company.models/product.models/product.model");
// const PurchaseOrderList = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/PurchaseOrderList");
const globalError = require("../../../../../../errors/global.error");

const getNewVcodeNumber = async (req, res, next) => {
  try {
    const generateUniqueVCode = async () => {
      const random = Math.floor(Math.random() * 1000);
      const v_code = `VA${random}`;

      const isVCode = await InWardDetail.findOne({
        where: {
          v_code,
        },
      });
      if (!isVCode) {
        return v_code;
      }
      return generateUniqueVCode();
    };

    const vCode = await generateUniqueVCode();

    return res.status(200).json({ success: true, data: vCode });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = { getNewVcodeNumber };
