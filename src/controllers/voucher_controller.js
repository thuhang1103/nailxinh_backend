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
  },

  createVoucher: async (req, res) => {
    try {
      const { Code, Description = '', MinOrderValue = 0, DiscountAmount = 0, StartDate, EndDate } = req.body || {};
      if (!Code) return res.status(400).json({ error: 'Code required' });

      const toSqlDate = (val) => {
        if (val == null || val === '') return null;
        const d = new Date(val);
        if (Number.isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
      };

      const start = toSqlDate(StartDate);
      const end = toSqlDate(EndDate);
      if (StartDate && start === null) return res.status(400).json({ error: 'Invalid StartDate' });
      if (EndDate && end === null) return res.status(400).json({ error: 'Invalid EndDate' });

      const voucherId = await VoucherModel.insertVoucher({
        Code,
        Description,
        MinOrderValue,
        DiscountAmount,
        StartDate: start,
        EndDate: end
      });

      console.log('created voucher id:', voucherId);
      if (!Number.isFinite(Number(voucherId))) return res.status(400).json({ error: 'Tạo voucher thất bại' });
      return res.status(201).json({ id: Number(voucherId) });
    } catch (err) {
      console.error('createVoucher error:', err);
      if (err && err.sqlState === '45000') return res.status(400).json({ error: err.sqlMessage || 'Voucher code đã tồn tại' });
      return res.status(500).json({ error: 'Tạo voucher thất bại' });
    }
  },

  updateVoucher: async (req, res) => {
    try {
      console.log('updateVoucher body:', req.body);
      const voucherId = Number(req.params.id);
      if (!Number.isInteger(voucherId) || voucherId <= 0) return res.status(400).json({ error: 'id required' });

      const {
        Code,
        Description,
        MinOrderValue = 0,
        DiscountAmount = 0,
        StartDate,
        EndDate,
        IsActive = 1
      } = req.body || {};

      if (!Code) return res.status(400).json({ error: 'Code required' });

      const toSqlDate = (val) => {
        if (val == null || val === '') return null;
        const d = new Date(val);
        if (Number.isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
      };

      const start = StartDate ? toSqlDate(StartDate) : null;
      const end = EndDate ? toSqlDate(EndDate) : null;
      if (StartDate && start === null) return res.status(400).json({ error: 'Invalid StartDate' });
      if (EndDate && end === null) return res.status(400).json({ error: 'Invalid EndDate' });

      const success = await VoucherModel.updateVoucher(voucherId, {
        Code,
        Description,
        MinOrderValue,
        DiscountAmount,
        StartDate: start,
        EndDate: end,
        IsActive
      });

      if (!success) return res.status(400).json({ error: 'Cập nhật voucher thất bại' });
      return res.json({ message: 'Cập nhật voucher thành công' });
    } catch (err) {
      console.error('updateVoucher error:', err);
      if (err && err.sqlState === '45000') return res.status(400).json({ error: err.sqlMessage || 'Voucher error' });
      return res.status(500).json({ error: 'Cập nhật voucher thất bại' });
    }
  },

  deleteVoucher: async (req, res) => {
    try {
      const voucherId = Number(req.params.id);
      const success = await VoucherModel.deleteVoucher(voucherId);
      if (!success) return res.status(400).json({ error: 'Xóa voucher thất bại' });
      return res.json({ message: 'Xóa voucher thành công' });
    } catch (err) {
      console.error('deleteVoucher error:', err);
      return res.status(500).json({ error: 'Xóa voucher thất bại' });
    }
  }
};

module.exports = VoucherController;