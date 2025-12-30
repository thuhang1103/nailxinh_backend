class CartItem {
  constructor({
    CartItemID,
    CartID,
    ProductID,
    VariantID,
    VariantName,
    Quantity,
    Price,
    Stock,
    Total,
    is_selected,
    CreatedAt,
    UpdatedAt,
    ProductName,
    ImagePath
  } = {}) {
    this.CartItemID = CartItemID ?? null;
    this.CartID = CartID ?? null;
    this.ProductID = ProductID ?? null;
    this.VariantID = VariantID ?? null;
    this.VariantName = VariantName ?? null;
    this.Quantity = Number(Quantity ?? 0);
    this.Price = Number(Price ?? 0);
    this.Stock = Number(Stock ?? 0);
    this.Total = Total ?? (this.Quantity * this.Price);
    this.is_selected = typeof is_selected !== 'undefined' ? is_selected : 0;
    this.CreatedAt = CreatedAt ?? null;
    this.UpdatedAt = UpdatedAt ?? null;
    this.ProductName = ProductName ?? null;
    this.ImagePath = ImagePath ?? null;
  }
}
module.exports = CartItem;
