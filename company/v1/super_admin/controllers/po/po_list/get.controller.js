const globalError = require("../../../../../../errors/global.error");
const { Op } = require("sequelize");
const PoList = require("../../../../../../models/company.models/po_and_poList.models/po_list.model");
const Po = require("../../../../../../models/company.models/po_and_poList.models/po.model");
const Product = require("../../../../../../models/company.models/product.models/product.model");
const MaterialGrade = require("../../../../../../models/company.models/product.models/material_grade.model");
const Drawing = require("../../../../../../models/company.models/product.models/drawing.model");
const Customer = require("../../../../../../models/company.models/customer.models/customer.model");
const { sequelize } = require("../../../../../../configs/database");

const getAllPoListByPoId = async (req, res, next) => {
  try {
    const { list_status = "reject" } = req.body;
    const allPoList = await PoList.findAll({
      where: { po_id },
    });

    if (allPoList[0] === 0) {
      return next(globalError(404, "PO list not found"));
    }

    if (list_status === "reject") {
      return res
        .status(200)
        .json({ success: true, message: "List successfully rejected" });
    }
    return res
      .status(200)
      .json({ success: true, message: "List successfully accepted" });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

const getAllProductListByPOId = async (req, res, next) => {
  try {
    const { customer_id } = req.body;
    const condition = {
      [Op.and]: [
        { deleted: false },
        { status: "processing" },
        { customer_id: customer_id },
        { status: { [Op.ne]: "delivered" } },
      ],
    };

    const { count, rows: po } = await Po.findAndCountAll({
      where: { ...condition },
      attributes: [
        "po_id",
        "poa",
        "status",
        "number",
        "currency_type",
        "date",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: PoList,
          attributes: [
            "po_list_id",
            "serial_number",
            "project_no",
            "quantity",
            "unit_price",
            "net_amount",
            "delivery_date",
            "description",
            "accept_description",
            "accept_delivery_date",
            "list_status",
            "createdAt",
          ],
          where: {
            list_status: "accepted",
          },
          include: [
            {
              model: Product,
              attributes: [
                "product_id",
                "name",
                "item_code",
                "product_code",
                "unit_measurement",
                "standard_lead_time",
                "standard_lead_time_type",
                "drawing_number",
              ],
              include: [
                {
                  model: MaterialGrade,
                  attributes: ["material_grade_id", "number"],
                },
              ],
            },
            {
              model: Drawing,
              attributes: ["drawing_id", "revision_number"],
            },
          ],
        },
      ],
    });

    if (!po) {
      return next(globalError(200, "Po not found"));
    }
    if (count === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const data = po?.map((obj) => {
      let { ...otherData } = obj.toJSON();

      return otherData;
    });

    let combinedPoLists = [];

    data.forEach((item) => {
      let po_number = item.number;
      let po_id = item.po_id;
      let date = item.date;
      let status = item.status;
      let poLists = item.PoLists.map((po) => ({
        ...po,
        po_number,
        date,
        status,
        po_id,
      }));
      combinedPoLists = combinedPoLists.concat(poLists);
    });
    return res
      .status(200)
      .json({ success: true, data: combinedPoLists, total: count });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllProjectNumberByProjectNumber = async (req, res, next) => {
  try {
    let { customer_id = "", number, DeliveryStatus = "0" } = req.body;
    let numberFilter = number && number != "  " ? " AND number= :number " : "";
    let customerFilter = customer_id ? " AND customer_id = :customer_id" : "";

    let que = `
    SELECT DISTINCT project_no FROM view_masterproductplaner
    WHERE 1 ${numberFilter} ${customerFilter}
    AND pending_quantity ${DeliveryStatus === "0" ? "> 0" : "= 0"} 
`; //earlier it was "= :DeliveryStatus"
    number = number && number != "  " ? number : "";

    let replacements = { number };

    if (customer_id) {
      replacements.customer_id = customer_id;
    }

    if (DeliveryStatus !== "0") {
      replacements.DeliveryStatus = DeliveryStatus;
    }

    const result = await sequelize.query(que, {
      replacements: replacements,
    });
    const uniqueNumbers = Array.from(
      new Set(result.flat().map((item) => item.project_no))
    );
    if (uniqueNumbers.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const data = [
      { label: "All Project Number", value: "" },
      ...uniqueNumbers.map((num) => ({ label: num, value: num })),
    ];

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getAllProjectSerialNumberByProjectNumber = async (req, res, next) => {
  try {
    const { project_no, DeliveryStatus = "0", number = "" } = req.body;
    let que = `
    SELECT DISTINCT serial_number FROM view_masterproductplaner
    WHERE project_no = :project_no ${number ? " AND number = :number " : " "} 
    AND pending_quantity ${DeliveryStatus === "0" ? "> 0" : "= 0"}
`;

    let replacements = { project_no, number };

    // if (DeliveryStatus !== "0") {
    //   replacements.DeliveryStatus = DeliveryStatus;
    // }

    const result = await sequelize.query(que, {
      replacements: replacements,
    });
    const uniqueNumbers = Array.from(
      new Set(result.flat().map((item) => item.serial_number))
    );
    if (uniqueNumbers.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const data = [
      { label: "All Serial Number", value: "" },
      ...uniqueNumbers.map((num) => ({ label: num, value: num })),
    ];

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const getAllPoListByPoListId = async (req, res, next) => {
  try {
    const { po_list_id } = req.body;
    const allPoList = await PoList.findByPk(po_list_id);

    if (!allPoList) {
      return next(globalError(404, "PO list not found"));
    }

    return res.status(200).json({ success: true, data: allPoList });
  } catch (error) {
    return next(globalError(500, "Internal server error"));
  }
};

module.exports = {
  getAllPoListByPoId,
  getAllProductListByPOId,
  getAllProjectNumberByProjectNumber,
  getAllProjectSerialNumberByProjectNumber,
  getAllPoListByPoListId,
};
