const { sequelize } = require("../../../../../configs/database");
const globalError = require("../../../../../errors/global.error");
const Note = require("../../../../../models/company.models/note.models/notes.model");

const updateNote = async (req, res, next) => {
  try {
    const { name, notes, note_id } = req.body;
    const value = {
      name,
      notes,
    };
    const note = await Note.update(value, {
      where: {
        note_id,
      },
    });
    if (!note) {
      return next(globalError(500, "Something went wrong"));
    }

    return res.status(200).json({
      success: true,
      message: "Notes Updated Successfully",
      data: { name, notes },
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { updateNote };
