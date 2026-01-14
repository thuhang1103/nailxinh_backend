const pool = require('../configs/db');
const Voucher = require('./voucher');

const VoucherModel = {
  getAllVouchersOrderByDiscountAsc: async () => {
    const [rows] = await pool.execute('CALL GetAllVouchersOrderByDiscountAsc()');
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return list.map(r => new Voucher(r));
  },

  getAvailableVouchers: async (total = 0) => {
    const pTotal = Number(total ?? 0);
    const [rows] = await pool.execute('CALL GetAvailableVouchers(?)', [pTotal]);
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return list.map(r => new Voucher(r));
  },

  getMaxVoucher: async () => {
    const [rows] = await pool.execute('CALL GetMaxVoucher()');
    const result = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    if (result.length === 0) return null;
    return new Voucher(result[0]);
  },

  // insert voucher, returns inserted VoucherID or null
  insertVoucher: async ({ Code, Description, MinOrderValue = 0, DiscountAmount = 0, StartDate = null, EndDate = null } = {}) => {
   
    const [rows] = await pool.execute(
    'CALL sp_insert_voucher(?, ?, ?, ?, ?, ?)',
    [Code, Description, MinOrderValue, DiscountAmount, StartDate, EndDate]
  );

  const voucherId = rows?.[0]?.[0]?.VoucherID ?? null;
  console.log('Inserted Voucher ID:', voucherId);

  return voucherId;
  },

  // update voucher, returns true if rows affected
  updateVoucher: async (voucherId, { Code, Description, MinOrderValue = 0, DiscountAmount = 0, StartDate = null, EndDate = null } = {}) => {
    const [rows] = await pool.execute(
      'CALL sp_update_voucher(?, ?, ?, ?, ?, ?, ?)',
      [voucherId, Code, Description, MinOrderValue, DiscountAmount, StartDate, EndDate]
    );
    const result = rows?.affectedRows ?? rows?.[1]?.affectedRows ?? 0;

  return result > 0;
  },

  // soft-delete voucher (set IsActive = 0), returns true if rows affected
  deleteVoucher: async (voucherId) => {
    const [rows] = await pool.execute('CALL sp_delete_voucher(?)', [voucherId]);
    const result = rows?.affectedRows ?? rows?.[1]?.affectedRows ?? 0;
    return result > 0;
  }
};

module.exports = VoucherModel;