


const { connectDB } = require("../configs/db");
const User = require("./User");

class UserModel {
  // Lấy tất cả người dùng
  static async getAllUsers() {
    const connection = await connectDB();
    const [rows] = await connection.execute("SELECT * FROM Users");
    return rows.map(row => new User(row));
  }

  // Tìm người dùng theo UserName
  static async findByUserName(UserName) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Users WHERE UserName = ?",
      [UserName]
    );
    return rows[0] || null;
  }
  static async findByEmail(Email) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Users WHERE Email = ?",
      [Email]
    );
    return rows[0] || null;
  }

  // Tìm người dùng theo Email
  static async findByID(UserID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Users WHERE UserID = ?",
      [UserID]
    );
    return rows[0] || null;
  }

  // Tạo người dùng mới
  
  static async createCustomer({ email, passwordHash, username, role }) {
  const connection = await connectDB();
  const [result] = await connection.execute(
    `INSERT INTO Users 
        (UserName, Email, Password, Role, Phone, avatarImage, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [username, email, passwordHash, role, null, 'default.png']
  );
  return {
    id: result.insertId,
  };
  }
  static async createStaff({ email, passwordHash, username, role }) {
  const connection = await connectDB();
  const [result] = await connection.execute(
    `INSERT INTO Users 
        (UserName, Email, Password, Role, Phone, avatarImage, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [username, email, passwordHash, role, null, 'default.png']
  );
  return {
    id: result.insertId,
  };
  }

  // Cập nhật thông tin người dùng
  static async update(id, user) {
    const connection = await connectDB();
    const fields = [];
    const values = [];

    const allowedFields = ['UserName', 'Email', 'Password', 'Role', 'Phone', 'avatarImage'];

    for (const key of allowedFields) {
      if (user[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(user[key]);
      }
    }

    if (fields.length === 0) {
      throw new Error("Không có dữ liệu để cập nhật");
    }

    // Cập nhật thời gian
    fields.push("UpdatedAt = CURRENT_TIMESTAMP");

    const sql = `UPDATE Users SET ${fields.join(", ")} WHERE UserID = ?`;
    values.push(id);

    await connection.execute(sql, values);
  }

  // Xóa người dùng
  static async delete(id) {
    const connection = await connectDB();
    await connection.execute(
      "DELETE FROM Users WHERE UserID = ?",
      [id]
    );
  }
  static async deleteRefreshToken(UserID) {
  try {
    const connection = await connectDB();
    await connection.execute(
      "DELETE FROM RefreshTokens WHERE UserID = ?",
      [UserID]
    );
    console.log(`Refresh token đã được xóa cho UserID: ${UserID}`);
  } catch (error) {
    console.error(`Lỗi xóa refresh token cho UserID: ${UserID}`, error);
    throw error;
  }
}
  static async saveRefreshToken(UserID, refreshToken, expiresAt) {
  try {
    const connection = await connectDB(); // Lấy connection trước
    const sql = `
      INSERT INTO RefreshTokens (UserID, Token, CreatedAt, ExpiresAt)
      VALUES (?, ?, NOW(), ?)
    `;
    await connection.execute(sql, [UserID, refreshToken, expiresAt]);
    console.log(`Refresh token đã được lưu cho UserID: ${UserID}`);
  } catch (error) {
    console.error(`Lỗi lưu refresh token cho UserID: ${UserID}`, error);
    throw error;
  }
  }
}




module.exports = UserModel;

