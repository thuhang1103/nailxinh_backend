
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
  static async create(req, res) {
    try {
      const newUser = await UserModel.createUser(req.body);
      res.status(201).json(newUser); 
      
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi thêm người dùng' });
    }
  }

  static async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      await UserModel.update(id, req.body);
      res.json({ message: 'Cập nhật người dùng thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi cập nhật người dùng' });
    }
  }

  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await UserModel.delete(id);
      res.json({ message: 'Xóa người dùng thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi xóa người dùng' });
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