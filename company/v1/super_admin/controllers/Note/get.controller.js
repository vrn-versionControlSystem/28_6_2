const { Op } = require("sequelize");
const Note = require("../../../../../models/company.models/note.models/notes.model");
const globalError = require("../../../../../errors/global.error");

const getAllNotesWithPagination = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "", type = "" } = req.body;
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    // if (type) {
    //   condition[Op.and].push({ type: type });
    // }

    // if (query) {
    //   condition[Op.and].push({
    //     [Op.or]: [
    //       {
    //         name: {
    //           [Op.like]: `%${query}%`,
    //         },
    //       },
    //       {
    //         customer_code: {
    //           [Op.like]: `%${query}%`,
    //         },
    //       },
    //     ],
    //   });
    // }

    const notes = await Note.findAndCountAll({
      where: { ...condition },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      attributes: ["note_id", "notes", "name"],
    });

    if (notes.rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    arr = notes.rows.map((m) => {
      const { note_id, notes, name } = m.toJSON();
      return { name, note_id, notes: JSON.parse(notes) };
    });
    return res
      .status(200)
      .json({ success: true, total: notes.count, data: arr });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

const getAllNotes = async (req, res, next) => {
  try {
    const condition = {
      [Op.and]: [{ deleted: false }],
    };

    const notes = await Note.findAll({
      where: { ...condition },
      attributes: ["note_id", "notes", "name"],
    });

    if (notes.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    arr = notes.map((m) => {
      const { note_id, notes, name } = m.toJSON();
      return { name, note_id, notes: JSON.parse(notes) };
    });
    return res.status(200).json({ success: true, data: arr });
  } catch (error) {
    next(globalError(500, error.message));
  }
};

module.exports = {
  getAllNotesWithPagination,
  getAllNotes,
};
