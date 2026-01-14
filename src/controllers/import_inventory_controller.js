const importInventoryModel = require('../models/import_inventory/import_inventory_model');

const ImportInventoryController = {
  createImportInventory: async (req, res) => {
    try {
      const { note = '', totalAmount, createdAt } = req.body || {};

      const total = Number(totalAmount ?? 0);
      if (Number.isNaN(total) || total < 0) {
        return res.status(400).json({ error: 'totalAmount invalid' });
      }

      const result = await importInventoryModel.createImportInventory(note, total, createdAt);
      if (!result || !result.ImportID) {
        return res.status(400).json({ error: 'Create failed' });
      }

      return res.status(201).json({ id: Number(result.ImportID) });
    } catch (err) {
      console.error('createImportInventory error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};
module.exports = ImportInventoryController;