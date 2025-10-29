


const pool = require("../configs/db");
const User = require("./User");

class UserModel {
  // Lấy tất cả người dùng
  static async getAllUsers() {
    const [rows] = await pool.execute("SELECT * FROM Users");
    return rows.map(row => new User(row));
  }

  // Tìm người dùng theo UserName
  static async findByUserName(UserName) {
    const [rows] = await pool.execute(
      "SELECT * FROM Users WHERE UserName = ?",
      [UserName]
    );
    return rows[0] || null;
  }
  static async findByEmail(Email) {
    const [rows] = await pool.execute(
      "SELECT * FROM Users WHERE Email = ?",
      [Email]
    );
    return rows[0] || null;
  }

  // Tìm người dùng theo Email
  static async findByID(UserID) {
    const [rows] = await pool.execute(
      "SELECT * FROM Users WHERE UserID = ?",
      [UserID]
    );
    return rows[0] || null;
  }

  // Tạo người dùng mới
  
  static async createCustomer({ email, passwordHash, username, role }) {
    console.log('Đang tạo user với:', { email, passwordHash, username, role });
  const [result] = await pool.execute(
    `INSERT INTO Users 
        (UserName, Email, Password, Role, Phone, avatarImage, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [username, email, passwordHash, role, null, 'default.png']
  );
  return {
      id: result.insertId,
  };
  }
  static async createStaff({ email, passwordHash, username}) {
  const [result] = await pool.execute(
    `INSERT INTO Users 
        (UserName, Email, Password, Role, Phone, avatarImage, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, 'Staff', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [username, email, passwordHash, null, 'default.png']
  );
  return {
    id: result.insertId,
  };
  }
  static async setPassword(UserID, passwordHash) {
  await pool.execute(
    "UPDATE Users SET Password = ?, UpdatedAt = CURRENT_TIMESTAMP WHERE UserID = ?",
    [passwordHash, UserID]
  );
}

  // Cập nhật thông tin người dùng
  static async update(id, user) {
  const fields = [];
  const values = [];

  const allowedFields = ['UserName', 'Email', 'Password', 'Role', 'Phone', 'avatarImage'];

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(user, key) && user[key] != null) {
      fields.push(`${key} = ?`);
      values.push(user[key]);
    }
  }

  if (fields.length === 0) {
    throw new Error("Không có dữ liệu hợp lệ để cập nhật");
  }

  fields.push("UpdatedAt = CURRENT_TIMESTAMP");

  const sql = `UPDATE Users SET ${fields.join(", ")} WHERE UserID = ?`;
  values.push(id);

  await pool.execute(sql, values);
}
  // Xóa người dùng
  static async delete(id) {
    await pool.execute(
      "DELETE FROM Users WHERE UserID = ?",
      [id]
    );
  }
  static async deleteRefreshToken(UserID) {
  try {
    await pool.execute(
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
    const sql = `
      INSERT INTO RefreshTokens (UserID, Token, CreatedAt, ExpiresAt)
      VALUES (?, ?, NOW(), ?)
    `;
    await pool.execute(sql, [UserID, refreshToken, expiresAt]);
    console.log(`Refresh token đã được lưu cho UserID: ${UserID}`);
  } catch (error) {
    console.error(`Lỗi lưu refresh token cho UserID: ${UserID}`, error);
    throw error;
  }
  }
}




module.exports = UserModel;

