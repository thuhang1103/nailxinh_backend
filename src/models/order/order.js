
class Order {
  constructor({ OrderID, AddressID, AddressName, VoucherID, TotalAmount, DiscountAmount, FinalAmount, OrderDate, UpdatedAt, Paid_Status, Order_Status }) {
    this.OrderID = OrderID;
    this.AddressID = AddressID;
    this.AddressName = AddressName;
    this.VoucherID = VoucherID;
    this.TotalAmount = TotalAmount;
    this.DiscountAmount = DiscountAmount;
    this.FinalAmount = FinalAmount;
    this.OrderDate = OrderDate;
    this.UpdatedAt = UpdatedAt;
    this.Paid_Status = Paid_Status;
    this.Order_Status = Order_Status;
  }
}

module.exports = Order;

     