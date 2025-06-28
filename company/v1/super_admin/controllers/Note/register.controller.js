const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Note = require("../../../../../models/company.models/note.models/notes.model");

const newNoteRegistration = async (req, res, next) => {
  try {
    const { name, notes } = req.body;
    const value = {
      name,
      notes,
      added_by: req.jwtTokenDecryptData.authority[0],
      added_by_id: req.jwtTokenDecryptData.user["user_id"],
    };
    const note = await Note.create(value);
    if (!note) {
      return next(globalError(500, "Something went wrong"));
    }

    return res.status(200).json({
      success: true,
      message: "Notes Added Successfully",
      data: { name, notes },
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { newNoteRegistration };
