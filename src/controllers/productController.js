const ProductModel = require('../models/productModel');

const ProductController = {

    getByName: async (req, res) => {
    const { name } = req.query;
    try {
       if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
      }
      const products = await ProductModel.getByName(name);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy sản phẩm theo tên' });
    }
  },

  getByCategory: async (req, res) => {
    const { categoryId } = req.params;
    try {
      const products = await ProductModel.getByCategory(categoryId);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy sản phẩm theo danh mục' });
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await ProductModel.getById(id);
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
      const products = await ProductModel.getByStatus(status);
      res.json(products);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm theo trạng thái:', err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  },
   async create(req, res) {
    try {
      await ProductModel.create(req.body);
      res.status(201).json({ message: 'Thêm sản phẩm thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      await ProductModel.update(id, req.body);
      res.json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
    }
  },

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await ProductModel.delete(id);
      res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
    }
  }
};

module.exports = ProductController;