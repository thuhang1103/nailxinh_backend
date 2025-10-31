// ImageID INT AUTO_INCREMENT PRIMARY KEY,
   // ProductID INT,
   // ImageURL VARCHAR(500),

class ProductImage {
  constructor({
    ImageID = null,
    ProductID = null,
    ImageURL = null
  } = {}) {
    this.ImageID = ImageID ?? null;
    this.ProductID = ProductID != null ? Number(ProductID) : null;
    this.ImageURL = ImageURL ?? null;
  }
}

module.exports = ProductImage;