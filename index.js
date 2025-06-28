const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { dbConnection } = require("./configs/databaseConnection");
const { initializeSocket } = require("./socket/connection");
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://erp.brothers.net.in",
      "https://brothersapi.vaishnaviprofile.com",
    ],
  })
);
app.use("/static/api/v1/", express.static("public"));
app.use("/api/static", express.static(path.join(__dirname, "./uploads")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json());

// eslint-disable-next-line no-undef
const version = process.env.COMPANY_VERSION_TYPE;
// eslint-disable-next-line no-undef
const versionOne = process.env.COMPANY_VERSION_NUMBER;

// common modules v1 routes 👇
// **************************************************

// Authentication
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/user/auth`,
  require("./company/v1/common/routes/auth.routes")
);

// *****************END************

// super admin modules v1 routes 👇
// **************************************************

//  User
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/user`,
  require("./company/v1/super_admin/routes/user.routes")
);

// *****************END************

//  Category 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/product/category`,
  require("./company/v1/super_admin/routes/product/category.routes")
);

// *****************END************

//  Material Grade 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/product/material-grade`,
  require("./company/v1/super_admin/routes/product/material_grade.routes")
);

// *****************END************

//  Pattern 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/product/pattern`,
  require("./company/v1/super_admin/routes/product/pattern.routes")
);

// *****************END************

//  Drawing 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/product/drawing`,
  require("./company/v1/super_admin/routes/product/drawing.routes")
);

// *****************END************

//  Product 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/product`,
  require("./company/v1/super_admin/routes/product/product.routes")
);

// *****************END************

//  Po 👇
// *****************START************
app.use(
  `/api/${version + versionOne}/web/company/po`,
  require("./company/v1/super_admin/routes/po/po.routes")
);
app.use(
  `/api/${version + versionOne}/web/company/po-list`,
  require("./company/v1/super_admin/routes/po/po_list.routes")
);
app.use(
  `/api/${version + versionOne}/web/company`,
  require("./company/v1/super_admin/routes/Note/note.routes")
);
// *****************END************

//  Quality 👇
// *****************START************
app.use(
  `/api/${version + versionOne}/web/company/quality`,
  require("./company/v1/super_admin/routes/quality/quality.routes")
);

// *****************END************

//  Purchase Order 👇
// *****************START************
app.use(
  `/api/${version + versionOne}/web/company/purchase/order`,
  require("./company/v1/super_admin/routes/purchaseOrder/purchaseOrder")
);
app.use(
  `/api/${version + versionOne}/web/company/purchase/order/list`,
  require("./company/v1/super_admin/routes/purchaseOrder/purchase_order_list")
);
// *****************END************

//  Inward 👇
// *****************START************
app.use(
  `/api/${version + versionOne}/web/company/inward`,
  require("./company/v1/super_admin/routes/inwardMaster/inwardMaster.routes")
);
// *****************END************
// Customer Shipping Address 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/customer/shipping-address`,
  require("./company/v1/super_admin/routes/customer/customer_shipping_address.routes")
);

// *****************END************y

// Customer Shipping Details 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/customer/shipping-details`,
  require("./company/v1/super_admin/routes/customer/customer_shipping_details.routes")
);

// *****************END************y

//  Customer 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/customer`,
  require("./company/v1/super_admin/routes/customer/customer.routes")
);

// *****************END************y

//  Dispatch Invoice 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/invoice/dispatch`,
  require("./company/v1/super_admin/routes/invoice/dispatch.routes")
);

app.use(
  `/api/${version + versionOne}/web/company/invoice/dispatch-list`,
  require("./company/v1/super_admin/routes/invoice/dispatch_list.routes")
);

// *****************END************

//  Dashboard 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/dashboard`,
  require("./company/v1/super_admin/routes/dashboard/dashboard.routes")
);

app.use(
  `/api/${version + versionOne}/web/company/customer/dashboard`,
  require("./company/v1/super_admin/routes/dashboard/customerDashboard.routes")
);

app.use(
  `/api/${version + versionOne}/web/company/product/dashboard`,
  require("./company/v1/super_admin/routes/dashboard/productDashboard.routes")
);

app.use(
  `/api/${version + versionOne}/web/company/instrument/dashboard`,
  require("./company/v1/super_admin/routes/dashboard/instruments.routes")
);

// *****************END************

// executive modules v1 routes 👇
// **************************************************

//  Po 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/executive/po`,
  require("./company/v1/executive/routes/po/po.routes")
);
// *****************END************

//  Worker 👇
// *****************START************
app.use(
  `/api/${version + versionOne}/web/company/worker`,
  require("./company/v1/super_admin/routes/worker/worker")
);
app.use(
  `/api/${version + versionOne}/web/company/worker/attendance`,
  require("./company/v1/super_admin/routes/worker/workerAttendance")
);

app.use(
  `/api/${version + versionOne}/web/company/worker/ledger`,
  require("./company/v1/super_admin/routes/worker/workerLedger")
);

app.use(
  `/api/${version + versionOne}/web/company/stock`,
  require("./company/v1/super_admin/routes/stock/stock")
);

app.use(
  `/api/${version + versionOne}/web/eway`,
  require("./company/v1/super_admin/routes/eWay/eWay")
);

// *****************END************

//  Enquiry 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/enquiry`,
  require("./company/v1/super_admin/routes/enquiry/enquiry")
);

// *****************END************

//  Machines 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/Machine`,
  require("./company/v1/super_admin/routes/machine/machine.routes")
);

app.use(
  `/api/${version + versionOne}/web/company/breakdown`,
  require("./company/v1/super_admin/routes/machine/breakdown.routes")
);

// *****************END************

//  Calibration 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/calibration`,
  require("./company/v1/super_admin/routes/calibration/calibration.routes")
);

// *****************END************

//  REPORTS 👇
// *****************START************

// MASTER PP REPORT 👇
app.use(
  `/api/${version + versionOne}/web/company/reports`,
  require("./company/v1/super_admin/routes/Report/report.routes")
);

// *****************END************

// MASTER PP REPORT 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/instrument`,
  require("./company/v1/super_admin/routes/Instruments/instrument.routes")
);

// *****************END************

// Tasks 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/task`,
  require("./company/v1/super_admin/routes/task/task.routes")
);

// *****************END************

//Delete Any File 👇
// *****************START************

app.use(
  `/api/${version + versionOne}/web/company/file`,
  require("./company/v1/super_admin/routes/fileDelete.routes")
);

// *****************END************

app.use(
  `/api/${version + versionOne}/web/company/data`,
  require("./company/v1/super_admin/routes/transfer/transfer.routes")
);

app.use(
  `/api/${version + versionOne}/web/company/module`,
  require("./company/v1/super_admin/routes/Module/module.routes")
);

app.use(
  `/api/${version + versionOne}/web/company/module/detail`,
  require("./company/v1/super_admin/routes/Module/moduleDetail.routes")
);

app.use(
  `/api/${version + versionOne}/web/company/test`,
  require("./company/v1/super_admin/routes/Test/test.routes")
);

// error handle
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    ...err,
    status,
    message,
  });
});

// Port setup
// eslint-disable-next-line no-undef
const port = process.env.PORT1 || 8000;
const server = app.listen(port, async () => {
  // eslint-disable-next-line no-undef
  console.log("running on ", process.env.BASE_URL + port);
  const dbConnect = await dbConnection();
  if (dbConnect) console.log("Database connected");
  else console.log("Database not connected");
});
initializeSocket(server);
