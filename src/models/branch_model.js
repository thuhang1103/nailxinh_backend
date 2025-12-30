const pool = require("../configs/db");


const BranchModel = {

  async getBranchContacts() {
    const [rows] = await pool.query('CALL GetBranchContacts()');
    return rows[0];
  },

  async getAverageRating() {
    const [rows] = await pool.query('CALL GetAverageRating()');
    return rows[0][0]; 
  },

  async getAllBranchReviews() {
    const [rows] = await pool.query('CALL GetAllBranchReviews()');
    return rows[0];
  }
};

export default BranchModel;