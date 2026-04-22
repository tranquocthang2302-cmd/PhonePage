const jwt = require("jsonwebtoken");
const path = require("path"); // Thư viện để xử lý đường dẫn
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const authMiddleware = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authemtiation",
        status: "error",
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authemtiation",
        status: "error",
      });
    }
  });
};
const authUserMiddleware = (req, res, next) => {
  // 1. Lấy token từ header
  const token = req.headers.token?.split(" ")[1];
  if (!token) {
    return res
      .status(404)
      .json({ message: "Token is required", status: "error" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authentication",
        status: "error",
      });
    }

    // 2. Logic kiểm tra quyền:
    // - Nếu là Admin: Cho qua luôn (Vế 1)
    // - Nếu là User thường: Chỉ cần Token hợp lệ là cho qua (Vế 2)
    // Ở trang Chi tiết đơn hàng, Backend sẽ dùng ID đơn hàng để tìm,
    // nên Middleware không cần so sánh ID người dùng ở đây nữa.

    if (user?.isAdmin || user?.id) {
      req.user = user; // Lưu thông tin user vào request để dùng ở Controller nếu cần
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "error",
      });
    }
  });
};
module.exports = {
  authMiddleware,
  authUserMiddleware,
};
