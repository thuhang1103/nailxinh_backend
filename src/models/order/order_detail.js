class OrderDetail {
  constructor({
    OrderDetailID = null,
    OrderID = null,
    ProductID = null,
    ProductName = null,
    VariantName = null,
    ImagePath = null,
    Quantity = 0,
    Price = 0,
    Total = 0
  } = {}) {
    this.OrderDetailID = OrderDetailID;
    this.OrderID = OrderID;
    this.ProductID = ProductID;
    this.ProductName = ProductName;
    this.VariantName = VariantName;
    this.ImagePath = ImagePath;
    this.Quantity = Number(Quantity) || 0;
    // DECIMAL from MySQL often comes as string -> convert to number
    this.Price = Number(Price) || 0;
    this.Total = Number(Total) || 0;
  }
}

module.exports = OrderDetail;