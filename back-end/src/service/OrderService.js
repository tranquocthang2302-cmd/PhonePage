const Order = require("../models/OderProduct");
const Product = require("../models/ProductModel");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      shippingMethod,
      isPaid,
      paidAt,
    } = newOrder;

    try {
      // 1. Chạy vòng lặp để trừ kho và tăng selled
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount }, // Điều kiện: Kho phải lớn hơn hoặc bằng số lượng đặt
          },
          {
            $inc: {
              countInStock: -order.amount, // Giảm kho
              selled: +order.amount, // Tăng số lượng đã bán (dùng amount - số lượng khách mua)
            },
          },
          { new: true },
        );

        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          // Trả về ID sản phẩm bị thiếu hàng
          return {
            status: "ERR",
            message: "ERR",
            id: order.product,
          };
        }
      });

      const results = await Promise.all(promises);

      // 2. Kiểm tra xem có sản phẩm nào bị lỗi (không đủ kho) không
      const fetchData = results.filter((item) => item.id); // Lấy ra những thằng có ID (tức là bị lỗi)

      if (fetchData.length > 0) {
        const arrId = fetchData.map((item) => item.id);
        return resolve({
          status: "ERR",
          message: `Sản phẩm với ID: ${arrId.join(", ")} không đủ hàng`,
          data: arrId,
        });
      }

      // 3. Nếu mọi thứ OK (không có lỗi kho), tạo 1 ĐƠN HÀNG DUY NHẤT
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: { fullName, address, city, phone },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user,
        shippingMethod,
        isPaid,
        paidAt,
      });

      if (createdOrder) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdOrder,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllOrderDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "DETAILS SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "DETAILS SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const cancelOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Tìm đơn hàng để lấy danh sách sản phẩm trước khi xóa
      const checkOrder = await Order.findById(id);

      if (checkOrder === null) {
        return resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      // 2. Cập nhật lại số lượng cho từng sản phẩm trong đơn hàng
      // Thắng dùng Promise.all để đợi tất cả sản phẩm cập nhật xong
      const updatePromises = checkOrder.orderItems.map(async (item) => {
        return Product.findOneAndUpdate(
          { _id: item.product }, // product ở đây là ID sản phẩm
          {
            $inc: {
              countInStock: +item.amount, // Cộng lại vào kho
              selled: -item.amount, // Trừ đi số lượng đã bán
            },
          },
          { new: true },
        );
      });

      await Promise.all(updatePromises);

      // 3. Sau khi cập nhật kho xong mới xóa đơn hàng
      const order = await Order.findByIdAndUpdate(
        id,
        { isCancelled: true }, // Đánh dấu là đã hủy
        { new: true },
      );

      resolve({
        status: "OK",
        message: "Cancel order and update stock success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm và cập nhật trực tiếp vào model Order
      const updatedOrder = await Order.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (updatedOrder === null) {
        resolve({
          status: "ERR",
          message: "Đơn hàng không tồn tại",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createOrder,
  getAllOrderDetail,
  getDetailOrder,
  cancelOrder,
  getAllOrder,
  updateOrder,
};
