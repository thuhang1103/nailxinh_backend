const pool = require('../configs/db');
const Cart = require('./cart');

const CartModel = {

  createCart: async (customerId) => {
    // CALL AddCart(?) thường trả về [ [...rows], ResultSetHeader ]
    const [rows] = await pool.execute(`CALL AddCart(?)`, [customerId]);
    const insertId = rows[0][0]?.insertId ?? 0;

  return insertId;
  },

  // delete
  deleteCart: async (cartId) => {
    const [rows] = await pool.execute(`CALL DeleteCart(?)`, [cartId]);
    const resultHeader = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return resultHeader?.affectedRows ?? 0;
  }

};

module.exports = CartModel;