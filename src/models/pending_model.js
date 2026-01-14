const pool = require('../configs/db');

const SpendingModel = {
  // Tổng chi trong tháng hiện tại (trả object { Year, Month, TotalSpending })
  getCurrentMonthSpending: async (userId) => {
    const [rows] = await pool.execute('CALL sp_get_current_month_spending_by_user(?)', [userId]);
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    const first = list[0] ?? null;
    if (!first) return { Year: null, Month: null, TotalSpending: 0 };
    return {
      Year: first.Year ?? null,
      Month: first.Month ?? null,
      TotalSpending: Number(first.TotalSpending ?? 0)
    };
  },

  // Tổng chi theo từng tháng trong năm hiện tại (trả mảng { Year, Month, TotalSpending })
  getMonthlySpendingCurrentYear: async (userId) => {
    const [rows] = await pool.execute('CALL sp_get_monthly_spending_current_year_by_user(?)', [userId]);
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return list.map(r => ({
      Year: r.Year ?? null,
      Month: r.Month ?? null,
      TotalSpending: Number(r.TotalSpending ?? 0)
    }));
  },

  // Số đơn hoàn thành trong tháng hiện tại
  countCompletedOrdersCurrentMonth: async (userId) => {
    const [rows] = await pool.execute('CALL sp_count_completed_orders_current_month_by_user(?)', [userId]);
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    const first = list[0] ?? null;
    return first ? Number(first.CompletedOrderCount ?? 0) : 0;
  },

  // Tổng tiền đơn hoàn thành trong năm hiện tại
  sumCurrentYear: async (userId) => {
    const [rows] = await pool.execute('CALL sp_sum_completed_amount_current_year_by_user(?)', [userId]);
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    const first = list[0] ?? null;
    return first ? Number(first.TotalAmount ?? 0) : 0;
  },

  // Số đơn hoàn thành trong năm hiện tại
  countCompletedOrdersCurrentYear: async (userId) => {
    const [rows] = await pool.execute('CALL sp_count_completed_orders_current_year_by_user(?)', [userId]);
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    const first = list[0] ?? null;
    return first ? Number(first.CompletedOrderCount ?? 0) : 0;
  }
};

module.exports = SpendingModel;

