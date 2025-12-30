const pool = require("../../configs/db");
const Address = require("./address");

const AddressModel = {

  getDefaultAddressByUserId: async (userId) => {
    const [rows] = await pool.execute('CALL GetDefaultAddressByUserID(?)', [userId]);
    const result = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    if (result.length === 0) return null;
    return new Address(result[0]);
  },

  addShippingAddressByUserId: async (userId, {
    ProvinceCode = null,
    DistrictCode = null,
    WardCode = null,
    RecipientName = null,
    Phone = null,
    Province = null,
    District = null,
    Ward = null,
    StreetAddress = null
  } = {}) => {
    const [rows] = await pool.execute(
      'CALL AddShippingAddressByUserID(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        ProvinceCode,
        DistrictCode,
        WardCode,
        RecipientName,
        Phone,
        Province,
        District,
        Ward,
        StreetAddress
      ]
    );
    const ok = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return (ok && (ok.affectedRows ?? ok.affectedRows === 0)) ? (ok.affectedRows > 0) : true;
  },

  
  getShippingAddressesByUserId: async (userId) => {
    const [rows] = await pool.execute('CALL GetShippingAddressesByUserID(?)', [userId]);
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return list.map(r => new Address(r));
  },

  deleteShippingAddressByUserId: async (userId, addressId) => {
    const [rows] = await pool.execute('CALL DeleteShippingAddressByUserID(?, ?)', [userId, addressId]);
    const ok = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return (ok && (ok.affectedRows ?? ok.affectedRows === 0)) ? (ok.affectedRows > 0) : true;
  },

  updateShippingAddressByUserId: async (userId, addressId, {
    ProvinceCode = null,
    DistrictCode = null,
    WardCode = null,
    RecipientName = null,
    Phone = null,
    Province = null,
    District = null,
    Ward = null,
    StreetAddress = null
  } = {}) => {
    const [rows] = await pool.execute(
      'CALL UpdateShippingAddressByUserID(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        addressId,
        ProvinceCode,
        DistrictCode,
        WardCode,
        RecipientName,
        Phone,
        Province,
        District,
        Ward,
        StreetAddress
      ]
    );
    const ok = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return (ok && (ok.affectedRows ?? ok.affectedRows === 0)) ? (ok.affectedRows > 0) : true;
  }

};

module.exports = AddressModel;