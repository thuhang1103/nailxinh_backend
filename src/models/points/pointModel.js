
const pool = require("../../configs/db");
const pointModel = {
  getLoyaltyPointsByUserId: async (userId) => {
    const [rows] = await pool.execute('CALL GetLoyaltyPointsByUserId(?)', [userId]);
    const result = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return result[0] ?? null; 
  },

  getMembershipLevelByUserId: async (userId) => {
    const [rows] = await pool.execute('CALL GetMembershipLevelByUserId(?)', [userId]);
    const result = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return result[0]?.MembershipLevel ?? null;
  },

  addDailyLoyaltyPoints: async (userId) => {
    const [rows] = await pool.execute('CALL AddDailyLoyaltyPointsByUserID(?)', [userId]);
    const resultHeader = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return resultHeader?.affectedRows ?? 0;
  },

  getCustomerPointsStatus: async (userId) => {
    const [rows] = await pool.execute('CALL GetCustomerPointsStatus(?)', [userId]);
    const result = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return result[0] ?? null;
  },
checkCanSpinToday: async (userId) => {
  const [rows, fields] = await pool.execute('CALL CheckCanSpinTodayByUserID(?)', [userId]);
  
  return rows[0]?.[0]?.canSpin === 1;  
},

  spinLucky: async (userId, points) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

    // 1. Check đã quay hôm nay chưa
    const [rows] = await conn.execute(
      'CALL CheckCanSpinToday(?)',
      [userId]
    );

    const canSpin = Number(rows[0][0].canSpin) === 1;
    if (!canSpin) {
      throw new Error('ALREADY_SPUN');
    }

    // 2. Cộng điểm (max 100000)
    await conn.execute(
  'CALL AddLuckySpinPoints(?, ?)',
  [userId, points]
  );

    // 3. Lưu log
    await conn.execute(
  'CALL InsertLuckySpinLogByUserId(?, ?)',
  [userId, points]
   );

    await conn.commit();
    return true;

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

};

module.exports = pointModel;