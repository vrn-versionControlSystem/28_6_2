const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Notes = require("../../../../../models/company.models/note.models/notes.model");

const deleteNote = async (req, res, next) => {
  try {
    const { note_id } = req.body;
    const value = {
      deleted: true,
    };
    const conditions = await Notes.update(value, {
      where: {
        note_id,
      },
    });
    if (!conditions) {
      return next(globalError(500, "Something went wrong"));
    }

    return res.status(200).json({
      success: true,
      message: "Condition Deleted",
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { deleteNote };
