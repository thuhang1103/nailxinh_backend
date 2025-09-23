
class User {
  constructor({ UserID, UserName, Email, Password, Role, Phone, CreatedAt, UpdatedAt ,AvatarImage}) {
    this.UserID = UserID;
    this.UserName = UserName;
    this.Email = Email;
    this.Password = Password; // hashed password nếu có
    this.Role = Role;
    this.Phone = Phone;
    this.CreatedAt = CreatedAt;
    this.UpdatedAt = UpdatedAt;
    this.AvatarImage = AvatarImage;
  }
}

module.exports = User;
