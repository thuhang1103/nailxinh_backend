const productModel = require('..//models/productModel');

const ProductController = {
  getAllSortedBySoldQuantity: async (req, res) => {
    try {
      const products = await productModel.getAllSortedBySoldQuantity();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy sản phẩm' });
    }
  },

  getByName: async (req, res) => {
    const { name } = req.query;
    console.log('Tên sản phẩm cần tìm:', name);
    try {
       if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
      }
      const products = await productModel.getByName(name);
      console.log ('danh sách sản phẩm ', products);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy sản phẩm theo tên' });
    }
  },

  getByCategory: async (req, res) => {
    const { categoryId } = req.params;
    try {
      const products = await productModel.getByCategory(categoryId);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy sản phẩm theo danh mục' });
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await productModel.getById(id);
      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }
      res.json(product);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm theo ID:', err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  },

  getByStatus: async (req, res) => {
    const { status } = req.params;
    try {
      const products = await productModel.getByStatus(status);
      res.json(products);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm theo trạng thái:', err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  },
   async create(req, res) {
    try {
      const product = req.body;
      await productModel.create(product);
      res.status(201).json({ message: 'Thêm sản phẩm thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const productData = req.body;
      await productModel.updateProduct(id, productData);
      res.json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
    }
  },

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await productModel.delete(id);
      res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
    }
  },

  getSuggestionsByName: async (req, res) => {
    const { name } = req.query;
    try {
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
      }
      const suggestions = await productModel.getSuggestionsByName(name);
      res.json(suggestions);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy gợi ý sản phẩm' });
    }
  }
};

module.exports = ProductController;