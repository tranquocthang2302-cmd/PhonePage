const mongoose = require("mongoose");
const productSechma = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String },
    discount: { type: Number },
    selled: { type: Number },
    newPrice: { type: Number }, // Phải khai báo trường này
  },
  {
    timestamps: true,
  },
);
productSechma.pre("save", function () {
  // Ép kiểu số để tránh lỗi tính toán nếu dữ liệu từ frontend là string
  const price = Number(this.price) || 0;
  const discount = Number(this.discount) || 0;

  // Tính toán giá mới
  this.newPrice = price - price * (discount / 100);

  // Lưu ý: Tuyệt đối không khai báo (next) và không gọi next() ở đây
});
const Product = mongoose.model("Product", productSechma);
module.exports = Product;
