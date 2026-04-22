const OrderService = require("../service/OrderService");
const JwtService = require("../service/JwtService");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      isPaid,
      paidAt,
    } = req.body;
    if (
      !paymentMethod ||
      itemsPrice === undefined ||
      shippingPrice === undefined ||
      !fullName ||
      !address ||
      !city ||
      !phone ||
      !totalPrice
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const result = await OrderService.createOrder(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllOrderDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "Error",
        message: "The userID is required",
      });
    }
    const response = await OrderService.getAllOrderDetail(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "Error",
        message: "The userID is required",
      });
    }
    const response = await OrderService.getDetailOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "Error",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.cancelOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllOrder = async (req, res) => {
  try {
    const response = await OrderService.getAllOrder();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Cần cung cấp ID đơn hàng",
      });
    }
    const response = await OrderService.updateOrder(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({ message: e });
  }
};
module.exports = {
  createOrder,
  getAllOrderDetail,
  getDetailOrder,
  cancelOrder,
  getAllOrder,
  updateOrder,
};
