const VoucherModel = require('../models/voucher_model');

const VoucherController = {
  getAllVouchers: async (req, res) => {
    try {
      const vouchers = await VoucherModel.getAllVouchersOrderByDiscountAsc();
      return res.json(vouchers);
    } catch (err) {
      console.error('getAllVouchers error:', err);
      return res.status(500).json({ error: 'Lấy voucher thất bại' });
    }
  },

  getMaxVoucher: async (req, res) => {
    try {
      const voucher = await VoucherModel.getMaxVoucher();
      if (!voucher) return res.status(404).json({ error: 'Không có voucher' });
      return res.json(voucher);
    } catch (err) {
      console.error('getMaxVoucher error:', err);
      return res.status(500).json({ error: 'Lấy voucher tốt nhất thất bại' });
    }
  },

  getAvailableVouchers: async (req, res) => {
    try {
      const total = Number(req.query.total ?? 0);
      const vouchers = await VoucherModel.getAvailableVouchers(total);
      return res.json(vouchers);
    } catch (err) {
      console.error('getAvailableVouchers error:', err);
      return res.status(500).json({ error: 'Lấy voucher khả dụng thất bại' });
    }
  }
};


module.exports = VoucherController;