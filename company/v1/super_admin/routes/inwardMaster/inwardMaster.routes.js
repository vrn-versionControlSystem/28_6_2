const express = require("express");
const multer = require("multer");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const {
  newInwardRegistration,
} = require("../../controllers/inWardMaster/register.controller");
const {
  getAllInward,
  getInwardDetailsById,
  getGRNNewNumbner,
} = require("../../controllers/inWardMaster/get.controller");
const {
  newInwardDetailRegistration,
  uploadNewInwardAttachment,
} = require("../../controllers/inWardMaster/inwardDetails/register.controller");

const {
  updatePurchaseOrderListStatusAndQuantity,
} = require("../../controllers/purchaseOrder/purchase_order_list/update");
const {
  updatePurchaseOrderStatusByPurhaseOrderIdOnQuantityRecevied,
} = require("../../controllers/purchaseOrder/update");
const {
  newStockInwardRegistration,
} = require("../../controllers/stock/register");

const jwtValidator = require("../../../../../utils/validators/token.validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../../../../uploads/inward");

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const now = new Date();
    let ext = file.mimetype.split("/");
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}.${ext[1]}`;

    cb(null, `${timestamp}`);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();
// upload.fields([
//   { name: "material_tc" },
//   { name: "inward_inspection" },
//   { name: "invoice" },
//   { name: "material_tc" },
// ]),

router.post(
  "/register",
  jwtValidator,
  newInwardRegistration,
  newInwardDetailRegistration,
  newStockInwardRegistration,
  updatePurchaseOrderListStatusAndQuantity,
  updatePurchaseOrderStatusByPurhaseOrderIdOnQuantityRecevied
);

// router.post(
//   "/attachment",
//   jwtValidator,
//   upload.fields([
//     { name: "material_tc" },
//     { name: "inward_inspection" },
//     { name: "invoice" },
//     { name: "heat_treatment" },
//   ]),
//   newInwardDetailRegistration,
//   newStockInwardRegistration,
//   updatePurchaseOrderListStatusAndQuantity,
//   updatePurchaseOrderStatusByPurhaseOrderIdOnQuantityRecevied
// );

router.put(
  "/upload/attachment",
  jwtValidator,
  upload.single("file"),
  uploadNewInwardAttachment
);

router.post("/", jwtValidator, getAllInward);
router.post("/id", jwtValidator, getInwardDetailsById);
router.get("/generate/grn", jwtValidator, getGRNNewNumbner);
module.exports = router;
