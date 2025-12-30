
class Address {
  constructor({ AddressID,  ProvinceCode,  DistrictCode,  WardCode,  RecipientName,  Phone,  Province,  District,  Ward,  StreetAddress,  FullAddress }) {
    this.AddressID = AddressID;
    this.ProvinceCode = ProvinceCode;
    this.DistrictCode = DistrictCode;
    this.WardCode = WardCode;
    this.RecipientName = RecipientName;
    this.Phone = Phone;
    this.Province = Province;
    this.District = District;
    this.Ward = Ward;
    this.StreetAddress = StreetAddress;
    this.FullAddress = FullAddress;
  }
}

module.exports = Address;
