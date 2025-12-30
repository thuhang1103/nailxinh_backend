const productModel = require('..//models/productModel');

function generateCombinations(arrays) {
  return arrays.reduce(
    (acc, curr) => acc.flatMap(a => curr.map(c => [...a, c])),
    [[]]
  );
}
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
  },
  //getImagesByProductId
  getImagesByProductId: async (req, res) => {
    const { productId } = req.params;
    try {
      const images = await productModel.getImagesByProductId(productId);
      res.json(images);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy hình ảnh sản phẩm' });
    }
  },
  //addProductimage
  addProductImage: async (req, res) => {
    const { productId, imageURL } = req.body;
    try {
      const insertId = await productModel.addProductImage(productId, imageURL);
      if (insertId && insertId > 0) {
        res.status(201).json({ message: 'Thêm hình ảnh sản phẩm thành công', insertId });
      } else {
        res.status(400).json({ error: 'Thêm hình ảnh sản phẩm thất bại' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi thêm hình ảnh sản phẩm' });
    }
  },
  //deleteProductImage
  deleteProductImage: async (req, res) => {
    const { imageId } = req.params;
    try {
      const affectedRows = await productModel.deleteProductImage(imageId);
      if (affectedRows) {
        res.json({ message: 'Xóa hình ảnh sản phẩm thành công' });
      } else {
        res.status(404).json({ error: 'Không tìm thấy hình ảnh sản phẩm' });
      }
    } catch (err) {
      console.error('Lỗi khi xóa hình ảnh sản phẩm:', err);
      res.status(500).json({ error: 'Lỗi khi xóa hình ảnh sản phẩm' });
    }
  },
  //  getVariantOptionsByProductID:

  getVariantOptionsByProductID: async (req, res) => {
    const { productId } = req.params;
    try {
      const options = await productModel.getVariantOptionsByProductID(productId);
      res.json(options);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy tùy chọn biến thể sản phẩm' });
    }
  },
  //addVariantOption:
  addVariantOption: async (req, res) => {
    const { productId, optionName } = req.body; 
    try {
      const insertId = await productModel.addVariantOption(productId, optionName);
      if (insertId && insertId > 0) {
        res.status(201).json({ message: 'Thêm tùy chọn biến thể thành công', insertId });
      } else {
        res.status(400).json({ error: 'Thêm tùy chọn biến thể thất bại' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi thêm tùy chọn biến thể' });
    }
  },
  //deleteVariantOption:
  deleteVariantOption: async (req, res) => {
    const { optionId } = req.params;
    try {
      const affectedRows = await productModel.deleteVariantOption(optionId);
      if (affectedRows) {
        res.json({ message: 'Xóa tùy chọn biến thể thành công' });
      } else {
        res.status(404).json({ error: 'Không tìm thấy tùy chọn biến thể' });
      }
    } catch (err) {
      console.error('Lỗi khi xóa tùy chọn biến thể:', err);
      res.status(500).json({ error: 'Lỗi khi xóa tùy chọn biến thể' });
    }
  },
  //updateVariantOptionName:
  updateVariantOptionName: async (req, res) => {
    const { optionId, newName } = req.body;
    try {
      const affectedRows = await productModel.updateVariantOptionName(optionId, newName);
      if (affectedRows) {
        res.json({ message: 'Cập nhật tên tùy chọn biến thể thành công' });
      } else {
        res.status(404).json({ error: 'Không tìm thấy tùy chọn biến thể' });
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật tên tùy chọn biến thể:', err);
      res.status(500).json({ error: 'Lỗi khi cập nhật tên tùy chọn biến thể' });
    }
  },
  //AddVariantValue
  addVariantValue: async (req, res) => {
    const { optionId, valueName } = req.body;
    try {
      const insertId = await productModel.addVariantValue(optionId, valueName);
      if (insertId && insertId > 0) {
        res.status(201).json({ message: 'Thêm giá trị biến thể thành công', insertId });
      } else {
        res.status(400).json({ error: 'Thêm giá trị biến thể thất bại' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi thêm giá trị biến thể' });
    }
  },
  //deletevariantValue
  deleteVariantValue: async (req, res) => {
    const { valueId } = req.params;
    try {
      const affectedRows = await productModel.deleteVariantValue(valueId);
      if (affectedRows) {
        res.json({ message: 'Xóa giá trị biến thể thành công' });
      } else {
        res.status(404).json({ error: 'Không tìm thấy giá trị biến thể' });
      }
    } catch (err) {
      console.error('Lỗi khi xóa giá trị biến thể:', err);
      res.status(500).json({ error: 'Lỗi khi xóa giá trị biến thể' });
    }
  },
  //updateVariantValueName:
  updateVariantValueName: async (req, res) => {
    const { valueId, newName } = req.body;  
    try {
      const affectedRows = await productModel.updateVariantValueName(valueId, newName);
      if (affectedRows) {
        res.json({ message: 'Cập nhật tên giá trị biến thể thành công' });
      } else {
        res.status(404).json({ error: 'Không tìm thấy giá trị biến thể' });
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật tên giá trị biến thể:', err);
      res.status(500).json({ error: 'Lỗi khi cập nhật tên giá trị biến thể' });
    }
  },
  //GetVariantValuesByOptionID
  getVariantValuesByOptionID: async (req, res) => {
    const { optionId } = req.params;
    try {
      const values = await productModel.getVariantValuesByOptionID(optionId);
      res.json(values);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy giá trị biến thể' });
    } 
  },
  generateProductVariants: async (req, res) => {
    const { productId } = req.body;
    try {
      const [options] = await productModel.getVariantOptionsByProductID(productId);

      if (options.length === 0) {
        return res.status(400).json({ error: "Sản phẩm chưa có option" });
      }

      const allValues = [];
      for (const opt of options) {
        const values = await productModel.getVariantValuesByOptionID(opt.OptionID);
        if (values.length > 0) allValues.push(values);
      }

      if (allValues.length === 0) {
        return res.status(400).json({ error: "Chưa có giá trị nào để tạo variant" });
      }

      
      const combinations = generateCombinations(allValues);

      
      for (const combo of combinations) {
        const [option1, option2] = combo;
        await productModel.insertProductVariant(productId, option1, option2);
      }

      res.json({ message: "Đã tạo biến thể tự động thành công" });
    } catch (err) {
      console.error("Lỗi khi tạo biến thể:", err);
      res.status(500).json({ error: "Lỗi khi tạo biến thể" });
    }
  },
  getVariantsByValueIds: async (req, res) => {
  const { valueId1, valueId2 } = req.query; // truyền qua query params
  try {
    const variants = await productModel.getVariantsByValueIds(valueId1, valueId2 || null);
    res.json(variants);
  } catch (err) {
    console.error("Lỗi khi lấy biến thể:", err);
    res.status(500).json({ error: "Lỗi khi lấy biến thể" });
  }
},
  getVariantIDByOptions: async (req, res) => {
    const option1ValueId = parseInt(req.query.option1ValueId);
const option2ValueId = req.query.option2ValueId 
    ? parseInt(req.query.option2ValueId)
    : null; 
    try {
      const variantId = await productModel.getVariantIDByOptions(option1ValueId, option2ValueId);
      if (variantId) {
        res.json({ variantId });
      } else {
        res.status(404).json({ error: 'Không tìm thấy biến thể' });
      }
    } catch (err) {
      console.error('Lỗi khi lấy ID biến thể:', err);
      res.status(500).json({ error: 'Lỗi khi lấy ID biến thể' });
    }
  },
  getSimilarProductsByKeywords: async (req, res) => {
    const { keywords } = req.body;
    try {
      const products = await productModel.getSimilarProductsByKeywords(keywords);
      res.json(products);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm tương tự:', err);
      res.status(500).json({ error: 'Lỗi khi lấy sản phẩm tương tự' });
    }
  }

};

module.exports = ProductController;