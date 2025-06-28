const globalError = require("../../../../../errors/global.error");
const { sequelize } = require("../../../../../configs/database");
const path = require("path");
const fs = require("fs");

const deleteAnyFile = async (req, res, next) => {
  try {
    const { query = "", filePath } = req.body;

    if (filePath) {
      let relativePath = filePath.split("uploads/")[1];
      const fileUrl = path.join(
        __dirname,
        "../../../../../uploads/",
        relativePath
      );

      fs.access(fileUrl, fs.constants.F_OK, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ success: false, message: "File not found" });
        }

        fs.unlink(fileUrl, (err) => {
          if (err) {
            return next(globalError(500, "Error deleting file"));
          }
        });
      });

      const [results, metadata] = await sequelize.query(query);

      if (metadata[0] === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Certificate Not Updated as NULL" });
      }

      res
        .status(200)
        .json({ message: "File deleted successfully", success: true });
    }
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = {
  deleteAnyFile,
};
