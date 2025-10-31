// OptionID INT AUTO_INCREMENT PRIMARY KEY,
//     ProductID INT,
//     OptionName VARCHAR(50),  -- Ví dụ: "Màu sắc", "Kích cỡ"

class VariantOption {
  constructor({
    OptionID = null,
    ProductID = null,
    OptionName = null
  } = {}) {
    this.OptionID = OptionID != null ? Number(OptionID) : null;
    this.ProductID = ProductID != null ? Number(ProductID) : null;
    this.OptionName = OptionName ?? null;
  }
}

module.exports = VariantOption;