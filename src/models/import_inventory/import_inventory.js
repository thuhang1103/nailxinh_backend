class Import_Inventory {
  constructor({
    ImportID = null,
    Note = null,
    TotalAmount = 0,
    CreatedAt = null
  } = {}) {
    this.ImportID = ImportID;
    this.Note = Note;
    this.TotalAmount = Number(TotalAmount) || 0;
    this.CreatedAt = CreatedAt;
   
  }
}

module.exports = Import_Inventory;
