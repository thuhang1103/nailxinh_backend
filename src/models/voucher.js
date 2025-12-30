class Voucher {
  constructor({
    VoucherID,
    Code,
    Description,
    DiscountAmount,
    MinOrderValue,
    StartDate,
    EndDate
  } = {}) {
    this.VoucherID = VoucherID ?? null;
    this.Code = Code ?? null;
    this.Description = Description ?? null;
    this.DiscountAmount = Number(DiscountAmount ?? 0);
    this.MinOrderValue = Number(MinOrderValue ?? 0);
    this.StartDate = StartDate ?? null;
    this.EndDate = EndDate ?? null;
  }
}
module.exports = Voucher;

  