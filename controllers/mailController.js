const transporter = require("../middlewares/mailMiddleware");

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

const sendEmail = async (req, res) => {
  const { email, name, payment } = req.body;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "🎫 Xác nhận đặt vé thành công",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #333;">🎉 Bạn ${name} đã đặt vé thành công!</h2>

      <p><strong>Tên dịch vụ:</strong> ${payment.service_name}</p>

      <p><strong>Ngày đặt vé:</strong> ${payment.orderDate}</p>

      <p><strong>Đơn vị:</strong><br />
        Người lớn × ${payment.countAdult}<br />
        Trẻ em × ${payment.countChild}
      </p>

      <p><strong>Họ và tên:</strong> ${payment.name}</p>
      <p><strong>Email:</strong> ${payment.email}</p>
      <p><strong>SĐT:</strong> ${payment.phone}</p>

      <p style="font-size: 18px; color: red;"><strong>Tổng cộng:</strong> ${formatCurrency(
        payment.amount
      )}</p>

      <hr style="margin: 20px 0;" />
      <p>🎫 Mã vé (QR):</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?data=${
        payment.id
      }&size=200x200" alt="Mã QR" />

      <p style="color: red; margin-top: 16px;">Vui lòng đưa mã này cho nhân viên khi sử dụng dịch vụ.</p>

      <p style="margin-top: 24px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Send mail successfully" });
  } catch (error) {
    console.error("Error when send email: ", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendEmail };
