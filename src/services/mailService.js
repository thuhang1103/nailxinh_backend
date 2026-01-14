const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
});

async function sendOtpEmail(email, otp) {
  console.log('Sending OTP email to:', email,otp);
  const mail = {
    from: `"NailXinh" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Mã OTP xác thực từ NailXinh',
    html: `<p>Mã OTP của bạn: <b>${otp}</b></p><p>Hết hạn trong ${process.env.OTP_TTL/60} phút</p><p>Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.</p>`,
  };
  return transporter.sendMail(mail);
}
async function sendConfirmationEmail(email, userName) {
  const mail = {
    from: `"NailXinh" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Xác nhận đổi mật khẩu thành công từ NailXinh',
    html: `<p>Tài khoản  ${userName} của bạn vừa đổi mật khẩu thành công </p>`,
  };
  return transporter.sendMail(mail);
}

module.exports = { sendOtpEmail, sendConfirmationEmail };