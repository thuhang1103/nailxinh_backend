class Cart {
  constructor({
    CartID,
    CustomerID,
    CreatedAt,
    UpdatedAt
  }) {
    this.CartID = CartID;
    this.CustomerID = CustomerID;
    this.CreatedAt = CreatedAt;
    this.UpdatedAt = UpdatedAt;
  }
}

module.exports = Cart;