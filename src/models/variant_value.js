// ValueID INT AUTO_INCREMENT PRIMARY KEY,
//     OptionID INT,
//     ValueName VARCHAR(50),   

class VariantValue {
  constructor({
    ValueID = null,
    OptionID = null,
    ValueName = null
  } = {}) {
    this.ValueID = ValueID != null ? Number(ValueID) : null;
    this.OptionID = OptionID != null ? Number(OptionID) : null;
    this.ValueName = ValueName ?? null;
  }
}

module.exports = VariantValue;
