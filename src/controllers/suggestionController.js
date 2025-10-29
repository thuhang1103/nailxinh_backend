const SuggestionModel = require('../models/suggestionModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SuggestionController = {


  getSuggestionsByName: async (req, res) => {
    const { name } = req.query;
    console.log ('đã vào getSuggestionsByName backend', name);
    try {
      if (!name || name.trim() === '') {
        console.log('Thiếu từ khóa tìm kiếm');
        return res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
      }
      const suggestions = await SuggestionModel.getSuggestionByName(name);
      console.log('Gợi ý sản phẩm:', suggestions);
      res.json(suggestions);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy gợi ý sản phẩm' });
    }
  },
  addSuggestion: async (req, res) => {
    try {
      const { refreshToken, keyWord } = req.body;
      if ( !keyWord || keyWord.trim() === '') {
        return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
      }
      if(!refreshToken) {
        userId=1;
      }else{
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        userId=payload.UserID;
      }
      console.log('userId từ token:', userId);
      console.log('keyWord từ body:', keyWord);
      await SuggestionModel.addKeyword(userId, keyWord);
      console.log('Thêm từ khóa gợi ý thành công');
      res.status(201).json({ message: 'Thêm từ khóa gợi ý thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi thêm từ khóa gợi ý' });
    }
  }
  
};

module.exports = SuggestionController;