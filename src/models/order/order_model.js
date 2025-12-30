const pool = require("../../configs/db");
const Order = require("./order");

function extractRows(rows) {
  if (!rows) return [];
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0];
  if (Array.isArray(rows)) return rows;
  return [];
}

function extractFirst(rows) {
  const list = extractRows(rows);
  return list.length ? list[0] : null;
}

const orderModel = {
  
  createOrder: async (
    userId,
    addressId,
    addressName,
    voucherId,
    totalAmount,
    discountAmount
  ) => {
    const [rows] = await pool.execute(
      "CALL CreateOrder(?, ?, ?, ?, ?, ?)",
      [
        userId,
        addressId,
        addressName,
        voucherId,
        totalAmount,
        discountAmount
      ]
    );
    const first = extractFirst(rows);
    return first ? Number(first.OrderID) : null;
  },

  getOrdersByUserAndStatus: async (userId, orderStatus) => {
    const [rows] = await pool.execute(
      "CALL GetOrdersByUserAndStatus(?, ?)",
      [userId, orderStatus]
    );
    const list = extractRows(rows);
    return list.map(r => new Order(r));
  },

  getOrdersByStatus: async (orderStatus) => {
    const [rows] = await pool.execute(
      "CALL GetOrdersByStatus(?)",
      [orderStatus]
    );
    const list = extractRows(rows);
    return list.map(r => new Order(r));
  },

  updateOrderStatus: async (orderId, orderStatus) => {
    const [rows] = await pool.execute(
      "CALL UpdateOrderStatus(?, ?)",
      [orderId, orderStatus]
    );
    const ok = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    const affected = ok && typeof ok.affectedRows === 'number' ? ok.affectedRows : null;
    return affected === null ? false : affected > 0;
  },

  // revenue helpers calling stored procedures
  getRevenueToday: async () => {
    const [rows] = await pool.execute('CALL sp_revenue_today()');
    const first = extractFirst(rows);
    return first ? Number(first.revenue_today ?? 0) : 0;
  },

  getRevenueCurrentMonth: async () => {
    const [rows] = await pool.execute('CALL sp_revenue_current_month()');
    const first = extractFirst(rows);
    return first ? Number(first.revenue_current_month ?? 0) : 0;
  },

  getRevenueCurrentQuarter: async () => {
    const [rows] = await pool.execute('CALL sp_revenue_current_quarter()');
    const first = extractFirst(rows);
    return first ? Number(first.revenue_current_quarter ?? 0) : 0;
  },

  getRevenueCurrentYear: async () => {
    const [rows] = await pool.execute('CALL sp_revenue_current_year()');
    const first = extractFirst(rows);
    return first ? Number(first.revenue_current_year ?? 0) : 0;
  }
};
module.exports = orderModel;