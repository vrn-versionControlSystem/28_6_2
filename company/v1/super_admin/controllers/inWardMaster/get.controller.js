const { Op } = require("sequelize");
const InWardMaster = require("../../../../../models/company.models/inwardMaster.models/inwardMaster.model");
const InWardDetail = require("../../../../../models/company.models/inwardMaster.models/inwardDetail.model");
const Customer = require("../../../../../models/company.models/customer.models/customer.model");
const Product = require("../../../../../models/company.models/product.models/product.model");
const PurchaseOrderList = require("../../../../../models/company.models/purchaseOrder_and_purchaseOrderList.models/PurchaseOrderList");
const CustomerPermanentAddress = require("../../../../../models/company.models/customer.models/customer_permanent_address.model");
const globalError = require("../../../../../errors/global.error");

const getAllInward = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };
    // if (query) {
    //   condition[Op.and].push({
    //     [Op.or]: [
    //       {
    //         drawing_number: {
    //           [Op.like]: `%${query}%`,
    //         },
    //       },
    //       {
    //         part_number: {
    //           [Op.like]: `%${query}%`,
    //         },
    //       },
    //     ],
    //   });
    // }

    const inward = await InWardMaster.findAndCountAll({
      where: { ...condition },
      include: [
        {
          model: Customer,
        },
        {
          model: InWardDetail,
        },
      ],
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]],
    });

    if (inward.rows.length === 0) {
      return res.status(200).json({ success: true, total: 0, data: [] });
    }
    return res
      .status(200)
      .json({ success: true, total: inward.count, data: inward.rows });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getInwardDetailsById = async (req, res, next) => {
  try {
    const { inward_id } = req.body;

    const inward = await InWardMaster.findOne({
      where: { inward_id: inward_id },
      include: [
        {
          model: Customer,
          include: [
            {
              model: CustomerPermanentAddress,
            },
          ],
        },
        {
          model: InWardDetail,
          include: [
            {
              model: Product,
            },
            {
              model: PurchaseOrderList,
            },
          ],
        },
      ],
    });

    if (!inward) {
      return res
        .status(200)
        .json({ success: false, message: "no details Exist" });
    }
    return res.status(200).json({ success: true, data: inward });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getGRNNewNumbner = async (req, res, next) => {
  try {
    const generateUniqueInward = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const random = Math.floor(Math.random() * 10000);
      const inward_no = `GRN/${year}/${random}`;

      const isInwardExist = await InWardMaster.findOne({
        where: {
          inward_no,
        },
      });
      if (!isInwardExist) {
        return inward_no;
      }
      return generateUniqueInward();
    };

    const grn = await generateUniqueInward();

    return res.status(200).json({ success: true, data: grn });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = { getInwardDetailsById, getAllInward, getGRNNewNumbner };
