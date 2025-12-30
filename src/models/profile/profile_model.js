
const pool = require("../../configs/db");
const Profile = require("./profile");
const customerModel = {
  getCustomerProfile: async (userId) => {
    const [rows] = await pool.execute('CALL GetUserProfile(?)', [userId]);
    const result = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    if (result.length === 0) return null;
    return new Profile(result[0]);
  },

  updateCustomerProfile: async (userId, fullName, phone) => {
    const [rows] = await pool.execute('CALL UpdateCustomerProfile(?, ?, ?)', [
      userId,
      fullName ?? null,
      phone ?? null
    ]);
    const result = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return result[0] ?? null;
  },

  deleteCustomerAccount: async (userId) => {
    const [rows] = await pool.execute('CALL DeleteUserAccount(?)', [userId]);
    const result = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return result[0] ?? null;
  }
};

module.exports = customerModel;