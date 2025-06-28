const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
  newDrawingRegistration,
  newDrawingRegistrationapi,
} = require("../../controllers/product/drawing/register.controller");
const {
  newPdfAttachmentRegistration,
} = require("../../controllers/pdf_attachment/register.controller");
const {
  updatePdfAttachment,
} = require("../../controllers/pdf_attachment/update.controller");

const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  getAllProductsWithDrawing,
  downloadDrawingByDrawingId,
} = require("../../controllers/product/get.controller");
const {
  getAllDrawingByProductId,
  getAllDrawingAsOption,
} = require("../../controllers/product/drawing/get.controller");
const {
  deleteDrawingByDrawingId,
  updateDrawingByDrawingId,
  updateFinishWeightInDispatchList,
} = require("../../controllers/product/drawing/update.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../../../../uploads/Drawings");

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
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

router.post(
  "/register",
  jwtValidator,
  upload.fields([
    { name: "process_attachment" },
    { name: "raw_attachment" },
    { name: "finish_attachment" },
  ]),
  newDrawingRegistration
);

router.post(
  "/register/new",
  jwtValidator,
  upload.fields([
    { name: "process_attachment" },
    { name: "raw_attachment" },
    { name: "finish_attachment" },
  ]),
  newDrawingRegistrationapi
);
router.get("/select", jwtValidator, getAllProductsWithDrawing);
router.post("/id", jwtValidator, getAllDrawingByProductId);
router.put(
  "/update/id",
  jwtValidator,
  upload.fields([
    { name: "process_attachment" },
    { name: "raw_attachment" },
    { name: "finish_attachment" },
  ]),
  updateDrawingByDrawingId,
  updateFinishWeightInDispatchList
);
router.delete("/delete/id", jwtValidator, deleteDrawingByDrawingId);

router.post("/download/id", jwtValidator, downloadDrawingByDrawingId);
router.get("/option", jwtValidator, getAllDrawingAsOption);

module.exports = router;
