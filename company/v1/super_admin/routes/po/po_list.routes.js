const express = require("express");
const multer = require("multer");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const {
  updatePoListByPoListId,
  updatePoListAttachment,
  DeletePoListAttachment,
  updateActualDate,
} = require("../../controllers/po/po_list/update.controller");
const {
  getAllProductListByPOId,
  getAllProjectNumberByProjectNumber,
  getAllProjectSerialNumberByProjectNumber,
  getAllPoListByPoListId,
} = require("../../controllers/po/po_list/get.controller");
const {
  updatePoStatusByPoId,
} = require("../../controllers/po/update.controller");
const jwtValidator = require("../../../../../utils/validators/token.validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(
      __dirname,
      "../../../../../uploads/PoListAttachment"
    );

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
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
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

router.put("/id", jwtValidator, updatePoListByPoListId, updatePoStatusByPoId);
router.post("/customer/id", jwtValidator, getAllProductListByPOId);
router.post("/po/number", jwtValidator, getAllProjectNumberByProjectNumber);
router.post(
  "/serial/number",
  jwtValidator,
  getAllProjectSerialNumberByProjectNumber
);

router.put(
  "/attachment",
  jwtValidator,
  upload.single("file"),
  updatePoListAttachment
);

router.put("/attachment/delete", jwtValidator, DeletePoListAttachment);
router.post("/list/id", jwtValidator, getAllPoListByPoListId);
router.post("/date/update", jwtValidator, updateActualDate);
module.exports = router;
