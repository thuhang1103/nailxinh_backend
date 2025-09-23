// src/services/auth.service.js
const cache = require('./cacheService');
const mail = require('./mailService');
const { generateOtp } = require('../utils/otp_util');
const { signRegistrationToken } = require('./tokenService');

const OTP_TTL = parseInt(process.env.OTP_TTL || '300', 10);

async function sendOtp(email) {
  const keyOtp = `otp:email:${email}`;
  const keyResend = `otp:resend:${email}`;

  // Simple rate-limit: nếu keyResend tồn tại -> deny (ví dụ 60s)
  const resend = await cache.get(keyResend);
  if (resend) {
    throw { status: 429, message: 'Bạn gửi quá nhanh. Vui lòng chờ.' };
  }

  const otp = generateOtp();
  await cache.set(keyOtp, otp, OTP_TTL);
  await cache.set(keyResend, '1', 60); // block resend trong 60s

  await mail.sendOtpEmail(email, otp);
  return true;
}

async function verifyOtp(email, otp) {
  const keyOtp = `otp:email:${email}`;
  const keyAttempts = `otp:attempts:${email}`;

  const saved = await cache.get(keyOtp);
  if (!saved) throw { status: 401, message: 'OTP hết hạn hoặc không tìm thấy' };

  if (saved !== otp) {
    const attempts = await cache.incr(keyAttempts);
    if (attempts === 1) await cache.expire(keyAttempts, 300); // reset attempts window
    if (attempts > 5) throw { status: 429, message: 'Quá nhiều lần thử. Thử lại sau.' };
    throw { status: 401, message: 'OTP không đúng' };
  }

  // OTP đúng: xóa key + reset attempts
  await cache.del(keyOtp);
  await cache.del(keyAttempts);

  // tạo registration token (chứa email)
  const regToken = signRegistrationToken({ email });
  return regToken;
}

module.exports = { sendOtp, verifyOtp };