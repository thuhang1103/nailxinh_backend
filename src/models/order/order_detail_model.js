const pool = require("../../configs/db");
const OrderDetail = require("./order_detail");

const orderDetailModel = {
  createOrderDetail: async (orderId, productId,productName,variantName,imagePath, quantity, price,) => {
    const [rows] = await pool.execute(
      "CALL CreateOrderDetail(?, ?, ?, ?, ?, ?, ?)",
      [orderId, productId,productName,variantName,imagePath, quantity, price]
    );
    const resultSet = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    const first = resultSet[0] ?? null;
    return first ? { OrderDetailID: Number(first.OrderDetailID) } : null;
  },

  getOrderDetailsByOrderId: async (orderId) => {
    const [rows] = await pool.execute(
      "CALL GetOrderDetailsByOrderID(?)",
      [orderId]
    );
     console.log('DEBUG GetOrderDetailsByOrderID rows:', JSON.stringify(rows, null, 2));
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return list.map(r => new OrderDetail(r));
  }
};

module.exports = orderDetailModel;