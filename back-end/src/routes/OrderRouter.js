const express = require("express");
const router = express.Router();
const OrderController = require("../controller/OrderController");
const {
  authUserMiddleware,
  authMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", authUserMiddleware, OrderController.createOrder);
router.get(
  "/get-all-order-detail/:id",
  authUserMiddleware,
  OrderController.getAllOrderDetail,
);
router.get(
  "/get-detail-order/:id",
  authUserMiddleware,
  OrderController.getDetailOrder,
);
router.get("/get-all-order", authMiddleware, OrderController.getAllOrder);
router.delete(
  "/cancel-order/:id",
  authUserMiddleware,
  OrderController.cancelOrder,
);
router.put("/update/:id", authUserMiddleware, OrderController.updateOrder);
module.exports = router;
