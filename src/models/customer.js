
// CREATE TABLE Customers (
//     CustomerID INT AUTO_INCREMENT PRIMARY KEY,   -- ID tự tăng
//     FullName VARCHAR(100) NOT NULL,              -- Họ tên
//     UserID INT,                                  -- ID User liên kết
//     LoyaltyPoints INT DEFAULT 0;
//     MembershipLevel ENUM('Bronze', 'Silver', 'Gold', 'Platinum') DEFAULT 'Bronze';
//     CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     CONSTRAINT FK_Customer FOREIGN KEY (UserID) REFERENCES Users(UserID)
// );
//customer 
class Customer {
  constructor({
    CustomerID,
    FullName,
    UserID,
    LoyaltyPoints,
    MembershipLevel,
    CreatedAt
  }) {
    this.CustomerID = CustomerID;
    this.FullName = FullName;
    this.UserID = UserID;
    this.LoyaltyPoints = LoyaltyPoints;
    this.MembershipLevel = MembershipLevel;
    this.CreatedAt = CreatedAt;
  }
}

module.exports = Customer;