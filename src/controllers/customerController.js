//customer model
const customerModel = require('../models/customerModel');

const CustomerController = {
  // GET /api/customers/user/:userId
  getCustomerByUserId: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!userId) return res.status(400).json({ error: 'userId không hợp lệ' });

      const customer = await customerModel.getCustomerByUserId(userId);
      if (!customer) return res.status(404).json({ error: 'Customer không tìm thấy' });

      return res.json(customer);
    } catch (err) {
      console.error('getCustomerByUserId error:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy thông tin customer' });
    }
  },

  // GET /api/customers/user/:userId/id
  getCustomerIdByUserId: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!userId) return res.status(400).json({ error: 'userId không hợp lệ' });

      const customerId = await customerModel.getCustomerIdByUserId(userId);
      if (customerId == null) return res.status(404).json({ error: 'CustomerID không tìm thấy' });

      return res.json({ CustomerID: customerId });
    } catch (err) {
      console.error('getCustomerIdByUserId error:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy CustomerID' });
    }
  },

  // POST /api/customers
  addCustomer: async (req, res) => {
    try {
      const { fullName, userId } = req.body;
      if (!fullName || !userId) return res.status(400).json({ error: 'fullName và userId là bắt buộc' });

      const insertId = await customerModel.addCustomer(fullName, Number(userId));
      return res.status(201).json({ message: 'Customer created', CustomerID: insertId });
    } catch (err) {
      console.error('addCustomer error:', err);
      return res.status(500).json({ error: 'Lỗi khi thêm customer' });
    }
  },

  // PATCH /api/customers/:customerId
  updateCustomer: async (req, res) => {
  try {
    // Lấy ID user từ JWT
    const userId = req.user.UserID;
    console.log('userId from token:', userId);
    if (!userId) return res.status(400).json({ error: 'Không xác định được user' });

    // Chỉ lấy các field được phép update
    const { fullName, loyaltyPoints, membershipLevel } = req.body;

    // Nếu không có field nào để update
    if (fullName === undefined && loyaltyPoints === undefined && membershipLevel === undefined) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const affected = await customerModel.updateCustomer(
      userId,
      fullName ?? null,
      loyaltyPoints ?? null,
      membershipLevel ?? null
    );

    if (affected === 0)
      return res.status(404).json({ error: 'Customer không tìm thấy hoặc không có thay đổi' });

    return res.json({ message: 'Cập nhật thành công', affectedRows: affected });
  } catch (err) {
    console.error('updateCustomer error:', err);
    return res.status(500).json({ error: 'Lỗi khi cập nhật customer' });
  }
},

  // DELETE /api/customers/:customerId
deleteCustomer: async (req, res) => {
  try {
    // Lấy ID user từ JWT
    const userId = req.user.UserID;
    if (!userId) return res.status(400).json({ error: 'Không xác định được user' });

    const affected = await customerModel.deleteCustomer(userId);

    if (affected === 0)
      return res.status(404).json({ error: 'Customer không tìm thấy hoặc đã xóa' });

    return res.json({ message: 'Xóa customer thành công' });
  } catch (err) {
    console.error('deleteCustomer error:', err);
    return res.status(500).json({ error: 'Lỗi khi xóa customer' });
  }
},

};

module.exports = CustomerController;