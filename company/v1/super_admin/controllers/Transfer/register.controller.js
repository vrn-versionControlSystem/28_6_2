const { Op } = require("sequelize");
const PdfAttachment = require("../../../../../models/company.models/pdfAttachment.model");
const Drawings = require("../../../../../models/company.models/product.models/drawing.model");
const fs = require('fs');
const path = require('path');
const { sequelize } = require("../../../../../configs/database");

const databaseToDisk = async (req, res, next) => {
    try {
      const { pageIndex = 1, pageSize = 10 } = req.body;
  
      const pdfRecords = await PdfAttachment.findAndCountAll({
        limit: pageSize,
        offset: (pageIndex - 1) * pageSize,
        attributes: [
          "pdf_attachment_id",
          "content",
          "original_name",
          "field_name"
        ],
      });
  
      const saveDirectory = path.join(__dirname, '../../../../../uploads/Drawings');
  
      for (const file of pdfRecords.rows) {
        const filePath = path.join(saveDirectory, file.original_name);
  
    
        fs.writeFileSync(filePath, file.content);
  
        const name = file.field_name;
        const drw = await Drawings.findOne({
          where: {
            [name]: file.pdf_attachment_id
          }
        });
  
        if (drw) {
          let value = {};
          if (name === "process_attachment") {
            value.process_attachment_path = filePath;
          } else if (name === "raw_attachment") {
            value.raw_attachment_path = filePath;
          } else {
            value.finish_attachment_path = filePath;
          }
  
          await Drawings.update(value, {
            where: {
              drawing_id: drw.drawing_id
            }
          });
        }
      }
  
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(globalError(500, error.message));
    }
  };

module.exports = {
    databaseToDisk,
   
  };