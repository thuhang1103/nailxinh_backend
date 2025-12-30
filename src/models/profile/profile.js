
class User {
  constructor({ UserName,  FullName,  Phone,  Email,  MembershipLevel }) {
    this.UserName = UserName;
    this.FullName = FullName;
    this.Phone = Phone;
    this.Email = Email;
    this.MembershipLevel = MembershipLevel;
  }
}

module.exports = User;
