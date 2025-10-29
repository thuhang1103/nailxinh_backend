const pool = require('../configs/db');
const Customer = require('./customer');
const CustomerModel = {

  findByIDInCustomer: async (UserID) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Customers WHERE UserID = ?",
      [UserID]
    );
    return rows[0] || null;
  },
  getCustomerByUserId: async (userId) => {
    const [rows] = await pool.execute("CALL GetCustomerByUserId(?)", [userId]);
    const resultRows = rows?.[0] ?? [];
    if (resultRows.length === 0) return null;
    return Customer ? new Customer(resultRows[0]) : resultRows[0];
  },

  getCustomerIdByUserId: async (userId) => {
    const [rows] = await pool.execute("CALL GetCustomerIdByUserId(?)", [userId]);
    const row = rows?.[0]?.[0];
    return row ? row.CustomerID : null;
  },

  addCustomer: async (fullName, userId) => {
    const [rows] = await pool.execute("CALL AddCustomer(?, ?)", [fullName, userId]);
    const insertId = rows[0][0]?.insertId ?? 0;

  return insertId;
   
  },
updateCustomer: async (userId, fullName = null, loyaltyPoints = null, membershipLevel = null) => {

  const [rows] = await pool.execute(
    "CALL UpdateCustomerByUserID(?, ?, ?, ?)",
    [userId, fullName, loyaltyPoints, membershipLevel]
  );
  const resultHeader = Array.isArray(rows[0]) ? rows[0] : rows;

  return resultHeader?.affectedRows ?? 0;
},
  deleteCustomer: async (userId) => {
    const [rows] = await pool.execute("CALL DeleteCustomerByUserID(?)", [userId]);
    const resultHeader = rows?.[1] ?? rows;
    return resultHeader?.affectedRows ?? 0;
  }
};

module.exports = CustomerModel;

