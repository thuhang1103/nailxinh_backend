
const Suggestion = require("./suggestions");
const pool = require("../configs/db");

const SuggestionModel = {
  getSuggestionByName: async (searchTerm) => {
    const [rows] = await pool.execute(
      "CALL GetTop10KeywordsByName(?)",
      [searchTerm]
    );
    return rows[0].map(row => new Suggestion(row));
  },
  addKeyword: async (userId, keyWord) => {
    await pool.execute(
      "CALL AddSearchLogUnique(?, ?)",
      [userId, keyWord]
    );
  },
};
module.exports = SuggestionModel;