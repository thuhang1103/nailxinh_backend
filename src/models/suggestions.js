const { connectDB } = require("../configs/db");

class Suggestion {
  constructor({  KeyWord, TotalSearches, UpdatedAt }) {
    
    this.keyWord = KeyWord;
    this.totalSearches = TotalSearches;
    this.updatedAt = UpdatedAt;
  }
}

module.exports = Suggestion;
