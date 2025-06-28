const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const PdfAttachment = require("../../../../../models/company.models/pdfAttachment.model");

const createNewValue = (obj, added_by, added_by_id) => {
  const { fieldname, originalname, mimetype, buffer, size } = obj;
  const value = {
    field_name: fieldname,
    original_name: originalname,
    mime_type: mimetype,
    content: buffer,
    size: size,
    added_by,
    added_by_id,
  };
  return value;
};

const newPdfAttachmentRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    if (req.files["process_attachment"] === undefined) {
      return next(globalError(403, "Process Sheet is required"));
    }
    if (req.files["raw_attachment"] === undefined) {
      return next(globalError(403, "Raw Attachment is required"));
    }
    if (req.files["finish_attachment"] === undefined) {
      return next(globalError(403, "Finish Attachment is required"));
    }

    if (Object.keys(req.files.process_attachment[0]).length === 0) {
      return next(globalError(403, "Process Sheet is required"));
    }
    if (Object.keys(req.files.raw_attachment[0]).length === 0) {
      return next(globalError(403, "Raw Attachment is required"));
    }
    if (Object.keys(req.files.finish_attachment[0]).length === 0) {
      return next(globalError(403, "Finish Attachment is required"));
    }

    const added_by = req.jwtTokenDecryptData.authority[0];
    const added_by_id = req.jwtTokenDecryptData.user["user_id"];

    const processValue = [
      {
        ...createNewValue(
          req.files.process_attachment[0],
          added_by,
          added_by_id
        ),
      },
      { ...createNewValue(req.files.raw_attachment[0], added_by, added_by_id) },
      {
        ...createNewValue(
          req.files.finish_attachment[0],
          added_by,
          added_by_id
        ),
      },
    ];
    const response = await PdfAttachment.bulkCreate(processValue, {
      returning: true,
    });
    if (response.length === 0) {
      t.rollback();
      return next(globalError(500, "something went wrong"));
    }
    const responseLength = response.length;
    for (let i = 0; i < responseLength; i++) {
      req[`${response[i].field_name}`] = response[i].toJSON().pdf_attachment_id;
    }
    req.t = t;
    return next();
  } catch (error) {
    t.rollback();
    return next(globalError(500, error.message));
  }
};

const newPdfAttachmentQAPRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    if (!req.file) {
      return next(globalError(403, "QAP is required"));
    }

    const added_by = req.jwtTokenDecryptData.authority[0];
    const added_by_id = req.jwtTokenDecryptData.user["user_id"];

    const processValue = createNewValue(req.file, added_by, added_by_id);

    const response = await PdfAttachment.create(processValue, {
      returning: true,
    });
    if (!response) {
      t.rollback();
      return next(globalError(500, "something went wrong"));
    }

    req[`${response.toJSON().field_name}`] =
      response.toJSON().pdf_attachment_id;

    req.t = t;
    return next();
  } catch (error) {
    t.rollback();
    return next(globalError(500, error.message));
  }
};

module.exports = {
  newPdfAttachmentRegistration,
  newPdfAttachmentQAPRegistration,
};
