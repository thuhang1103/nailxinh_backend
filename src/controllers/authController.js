const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
 const authService = require('../services/authService');
//const userRepo = require('../repositories/user.repo'); 

class AuthController {
    static async getUserID(req, res){
    try {
      const userId = req.user?.UserID ?? req.user?.userId ?? req.user?.id;
      if (userId) return res.json({ ok: true, UserID: Number(userId) });

      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      if (!authHeader) return res.status(401).json({ ok: false, message: 'Unauthorized' });

      const token = authHeader.split(' ')[1] ?? authHeader;
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const tokenUserId = payload?.UserID ?? payload?.userId ?? payload?.id;
      if (!tokenUserId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

      return res.json({ ok: true, UserID: Number(tokenUserId) });
    } catch (err) {
      console.error('getUserID error:', err);
      if (err.name === 'TokenExpiredError') return res.status(401).json({ ok: false, message: 'Token expired' });
      if (err.name === 'JsonWebTokenError') return res.status(401).json({ ok: false, message: 'Invalid token' });
      return res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
  static async login(req, res) {
    console.log(req.body);
    const { UserName, Password } = req.body;
    const user = await userModel.findByUserName(UserName);
    if (!user) return res.status(401).json({ message: 'Tên đăng nhập không tồn tại' });

    const isValid = await bcrypt.compare(Password,user.Password);
  //   if (Password !== user.Password) {
  //     return res.status(401).json({ message: 'Sai mật khẩu' });
  //  }
    if (!isValid) return res.status(401).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign(
      { UserID: user.UserID, Role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { UserID: user.UserID },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userModel.saveRefreshToken(user.UserID, refreshToken, expiresAt);
    console.log({ token, refreshToken });

    res.json({ token, refreshToken });
  }
  static async logout(req, res) {
    const userId = req.user.UserID;
    await userModel.deleteRefreshToken (userId);
    res.json({ success: true, message: "Logged out" });
  }

  static async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Missing refresh token' });
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await userModel.findByID(payload.UserID);
      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
      

      const newToken = jwt.sign(
        { UserID: user.UserID, Role: user.Role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      const newRefreshToken = jwt.sign( 
        { UserID: user.UserID },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

        // Lưu refreshToken vào DB nếu cần
        await userModel.saveRefreshToken(user.UserID, newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

       // Trả về cả token và refreshToken cho client
        res.json({ token: newToken, refreshToken: newRefreshToken });
    } catch (err) {
      console.log('lỗi refresh token backend', err);
      res.status(401).json({ message: 'Refresh token expired or invalid' });
    }
  }
 // giả sử

 static async  sendOtp(req, res) {
  try {
    console.log('đã vào sentotp backend', req.body.email);

    const { email } = req.body;
    if (!email) return res.status(400).json({ ok:false, message:'Email required' });
    await authService.sendOtp(email);
    console.log('OTP đã được gửi đến email:', email);
    return res.json({ ok:true, message:'OTP sent' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ ok:false, message: err.message || 'Server error' });
  }
}

static async verifyOtp(req, res) {
  try {
   console.log('đã vào verify otp backend', req.body);
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ ok:false, message:'Email & OTP required' });
    const regToken = await authService.verifyOtp(email, otp);
    return res.json({ ok:true, registrationToken: regToken });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ ok:false, message: err.message || 'Server error' });
  }
}

static async registerCustomer(req, res) {
  try {
    const { email, password, username, registrationToken } = req.body;
     const existingEmail = await userModel.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ ok: false, message: 'Email đã tồn tại' });
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await userModel.findByUserName(username);
    if (existingUsername) {
      return res.status(400).json({ ok: false, message: 'Tên đăng nhập đã tồn tại' });
    }
    // verify registrationToken (use token.service)
    const { verifyToken } = require('../services/tokenService');
    const payload = verifyToken(registrationToken);
    console.log('verify được token payload', payload.email);
    if (payload.email !== email) {
      console.log('email khong đúng ');
      return res.status(401).json({ ok:false, message:'Token invalid' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await userModel.createCustomer({ email: email, passwordHash: hashed, username: username, role: 'Customer' });
    return res.status(201).json({ ok:true, message:'Customer registered', userId: newUser.id});

  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ ok:false, message: err.message || 'Server error' });
  }
}

static async resetPassword(req, res) {
  try {
    const { email, password, resetpassToken } = req.body;
    if (!email || !password || !resetpassToken) {
      return res.status(400).json({ ok: false, message: 'Thiếu thông tin' });
    }
     const existingEmail = await userModel.findByEmail(email);
    if (!existingEmail) {
      return res.status(400).json({ ok: false, message: 'Email chưa đăng kí ' });
    }
    console.log('có email', existingEmail);
    // verify registrationToken (use token.service)
    const { verifyToken } = require('../services/tokenService');
    const payload = verifyToken(resetpassToken);
    console.log('verify được token payload', payload.email);
    if (payload.email !== email) {
      console.log('email khong đúng ');
      return res.status(401).json({ ok:false, message:'Token invalid' });
    }
    const hashed = await bcrypt.hash(password, 10);
    console.log('chuẩn bị tạo mật khẩu mới :', hashed);
    await userModel.setPassword(existingEmail.UserID, hashed);
    console.log('đổi mật khẩu thành công ', existingEmail);
    
    await authService.sendConfirmationEmail(email, existingEmail.UserName);

    return res.status(201).json({ ok:true, message:'password reseted', userName: existingEmail.UserName });

  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ ok:false, message: err.message || 'Server error' });
  }
}

static async registerStaff(req, res) {
  try {
    const { email, password, username} = req.body;
    // verify registrationToken (use token.service)
    // const { verifyToken } = require('../services/token.service');
    // const payload = verifyToken(registrationToken);
    // if (payload.email !== email) return res.status(401).json({ ok:false, message:'Token invalid' });

    // create user (hash password)
    
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await userModel.createStaff({ email, passwordHash: hashed, username });
    return res.status(201).json({ ok:true, message:'Staff registered', userId: newUser.id });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ ok:false, message: err.message || 'Server error' });
  }
}

  static async checkToken(req, res) {
  try {
    // Lúc này authenticateJWT đã gắn decoded payload vào req.user
    const userId = req.user.UserID;

    // Query DB để lấy thông tin user
    const [rows] = await db.query(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = rows[0];

    return res.json({
      success: true,
      message: 'Token valid',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Check token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
}




module.exports = AuthController;