const OrderService = require("../service/OrderService");
const JwtService = require("../service/JwtService");

const fetch = require("node-fetch");

const CLIENT_ID = "CLIENT_ID_SANDBOX";
const SECRET = "SECRET_SANDBOX";

// 🔑 lấy access token
const getAccessToken = async () => {
  const auth = Buffer.from(CLIENT_ID + ":" + SECRET).toString("base64");

  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
};

// 🔥 capture paypal
const capturePaypal = async (req, res) => {
  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({
        status: "ERR",
        message: "orderID is required",
      });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};
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
  capturePaypal,
};
