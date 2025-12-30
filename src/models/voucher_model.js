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
  }
};

module.exports = VoucherModel;