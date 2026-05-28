const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Backend WT" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

exports.emailTemplates = {
  verifyEmail: (username, url) => ({
    subject: 'Xác thực email của bạn',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Xin chào ${username}!</h2>
        <p>Nhấn vào nút bên dưới để xác thực email:</p>
        <a href="${url}" style="background:#4F46E5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Xác thực Email</a>
        <p style="color:#666;margin-top:16px">Link hết hạn sau 24 giờ.</p>
      </div>
    `,
  }),

  forgotPassword: (username, url) => ({
    subject: 'Đặt lại mật khẩu',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Xin chào ${username}!</h2>
        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
        <a href="${url}" style="background:#EF4444;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Đặt lại mật khẩu</a>
        <p style="color:#666;margin-top:16px">Link hết hạn sau 1 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      </div>
    `,
  }),

  welcomeEmail: (username) => ({
    subject: 'Chào mừng bạn đến với Backend WT!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Chào mừng ${username}! 🎉</h2>
        <p>Tài khoản của bạn đã được xác thực thành công.</p>
        <p>Bạn có thể bắt đầu sử dụng dịch vụ ngay bây giờ.</p>
      </div>
    `,
  }),
};
