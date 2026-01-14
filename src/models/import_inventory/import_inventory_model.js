const pool = require("../../configs/db");
const Import_Inventory = require("./import_inventory");

const importInventoryModel = {
  createImportInventory: async (note, totalAmount, createdAt) => {
    // normalize createdAt to MySQL DATETIME string if Date provided
    const toSqlDatetime = (d) => {
      if (d == null) return null;
      if (d instanceof Date) return d.toISOString().slice(0, 19).replace('T', ' ');
      const parsed = new Date(d);
      if (Number.isNaN(parsed.getTime())) return null;
      return parsed.toISOString().slice(0, 19).replace('T', ' ');
    };

    const created = toSqlDatetime(createdAt);

    const [rows] = await pool.execute(
      "CALL sp_create_inventory_import(?, ?, ?)",
      [note, totalAmount, created]
    );

    let id = null;
    try {
      if (Array.isArray(rows)) {
        const first = rows[0];
        if (Array.isArray(first)) {
          id = first[0]?.ImportID ?? first[0]?.importid ?? first[0]?.insertId ?? null;
        } else {
          id = first?.ImportID ?? first?.importid ?? first?.insertId ?? null;
        }
      } else if (rows && typeof rows === 'object') {
        id = rows.ImportID ?? rows.importid ?? rows.insertId ?? null;
      }
    } catch (e) {
      id = null;
    }

    return id !== null ? { ImportID: Number(id) } : null;
  },

};

module.exports = importInventoryModel;
