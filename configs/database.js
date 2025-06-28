const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();

const host = process.env.HOST;
const username = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const databaseType = process.env.DATABASE_TYPE;
const dbPort = process.env.DB_PORT;
// const host1 = "https://erp.brothers.5techg.com/api";

const caCertPath = path.join(__dirname, "../certs", "ca-certificate.crt");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(database, username, password, {
  host,
  port: dbPort,
  dialect: databaseType,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      ca: fs.readFileSync(caCertPath),
    },
  },
});

// const sequelize = new Sequelize(
//   mysql://${username}:${password}@${host1}:${5005}/${database}
// );

module.exports = { sequelize };

// const { Sequelize } = require("sequelize");
// const dotenv = require("dotenv");
// dotenv.config();

// const host = process.env.HOST;
// const username = process.env.USER;
// const password = process.env.PASSWORD;
// const database = process.env.DATABASE;
// const databaseType = process.env.DATABASE_TYPE;
// // const host1 = "https://erp.brothers.5techg.com/api";

// // Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize(database, username, password, {
//   host,
//   dialect: databaseType,
//   logging: false,
// });

// // const sequelize = new Sequelize(
// //   `mysql://${username}:${password}@${host1}:${5005}/${database}`
// // );

// module.exports = { sequelize };
