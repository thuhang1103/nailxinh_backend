class Product {
  constructor({
    ProductID = null,
    ProductName = null,
    Description = null,
    BasePrice = null,
    CategoryID = null,
    StockQuantity = null,
    SoldQuantity = null,
    HasVariant = null,
    ImagePath = null,
    CreatedAt = null,
    UpdatedAt = null,
    Status_Product = null,
    Is_Deleted = null
  } = {}) {
    this.ProductID = ProductID ?? null;
    this.ProductName = ProductName ?? null;
    this.Description = Description ?? null;
    this.BasePrice = BasePrice != null ? Number(BasePrice) : null;
    this.CategoryID = CategoryID != null ? Number(CategoryID) : null;
    this.StockQuantity = StockQuantity != null ? Number(StockQuantity) : 0;
    this.SoldQuantity = SoldQuantity != null ? Number(SoldQuantity) : 0;
    this.HasVariant = HasVariant != null ? Boolean(HasVariant) : false;
    this.ImagePath = ImagePath ?? null;
    this.CreatedAt = CreatedAt ?? null;
    this.UpdatedAt = UpdatedAt ?? null;
    this.Status_Product = Status_Product ?? null;
    this.Is_Deleted = Is_Deleted != null ? Boolean(Is_Deleted) : false;
  }
}

module.exports = Product;
