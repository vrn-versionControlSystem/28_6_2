const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  NewInstrument,
  uploadCertificateAttachment,
} = require("../../controllers/Instruments/register.controller");
const {
  getInstruments,
  getAllInstruments,
} = require("../../controllers/Instruments/get.controller");
const {
  updateInstrument,
} = require("../../controllers/Instruments/update.controller");
const {
  deleteInstrument,
} = require("../../controllers/Instruments/delete.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(
      __dirname,
      "../../../../../uploads/Instrument"
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

router.post("/register", jwtValidator, NewInstrument);
router.get("/all", jwtValidator, getAllInstruments);
router.post("/", jwtValidator, getInstruments);
router.put("/update", jwtValidator, updateInstrument);
router.delete("/delete", jwtValidator, deleteInstrument);
router.put(
  "/upload/attachment",
  jwtValidator,
  upload.single("file"),
  uploadCertificateAttachment
);

module.exports = router;
