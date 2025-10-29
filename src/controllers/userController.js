
const UserModel = require("../models/userModel");

class UserController {
  // Lấy danh sách tất cả user
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (err) {
      console.error("Error in UserController:", err);
      res.status(500).send("Server Error");
    }
  }
  

static async update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const userData = req.body;

    await UserModel.update(id, userData);

    res.json({ ok: true, message: 'Cập nhật người dùng thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message || 'Lỗi khi cập nhật người dùng' });
  }
}

  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await UserModel.delete(id);
      res.json({ ok: true, message: 'Xóa người dùng thành công' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message  });
    }
  }
  static async checkUsername(req, res) {
  try {
    const { username } = req.body;
    const user = await UserModel.findByUserName(username);
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi kiểm tra username' });
  }
}

static async checkEmail(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findByEmail(email);
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi kiểm tra email' });
  }
}

  // Các phương thức khác như register, login có thể thêm tương tự
}
module.exports = UserController; 