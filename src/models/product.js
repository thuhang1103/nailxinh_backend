class Product {
  constructor({
    ProductID,
    ProductName,
    Description,
    Price,
    CategoryID,
    StockQuantity,
    SoldQuantity,
    ImagePath,
    CreatedAt,
    UpdatedAt,
    status_Product
  }) {
    this.ProductID = ProductID;
    this.ProductName = ProductName;
    this.Description = Description;
    this.Price = Price;
    this.CategoryID = CategoryID;
    this.StockQuantity = StockQuantity;
    this.SoldQuantity = SoldQuantity;
    this.ImagePath = ImagePath;
    this.CreatedAt = CreatedAt;
    this.UpdatedAt = UpdatedAt;
    this.Status_Product = status_Product;
  }
}

module.exports = Product;