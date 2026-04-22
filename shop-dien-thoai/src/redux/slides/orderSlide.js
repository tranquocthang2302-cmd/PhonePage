import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  selectedItemOrders: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
};
export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) =>
          item?.product === orderItem?.product &&
          item?.user === orderItem?.user,
      );

      if (itemOrder) {
        // Tính toán tổng số lượng mới nếu cộng thêm
        const newAmount = itemOrder.amount + orderItem?.amount;

        // CHỈ CỘNG nếu tổng mới nhỏ hơn hoặc bằng số lượng trong kho
        if (newAmount <= itemOrder.countInStock) {
          itemOrder.amount = newAmount;
        } else {
          // Nếu vượt quá, ép về số lượng tối đa trong kho
          itemOrder.amount = itemOrder.countInStock;
        }
      } else {
        state.orderItems.push(orderItem);
      }
    },
    handleChangeCount: (state, action) => {
      const { idProduct, value } = action.payload;
      // 1. Cập nhật ở mảng gốc (để giao diện hiện đúng số lượng)
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct,
      );
      if (itemOrder) {
        itemOrder.amount = value;
      }
      const itemOrderSelected = state?.selectedItemOrders?.find((item) => {
        return item.product === idProduct;
      });
      if (itemOrderSelected) {
        itemOrderSelected.amount = value;
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      const newOrderItems = state?.orderItems?.filter(
        (item) => item?.product !== idProduct,
      );
      state.orderItems = newOrderItems;
    },
    removeManyOrderProduct: (state, action) => {
      const { listChecked } = action.payload; // Đây là mảng các ID truyền lên
      const newOrderItems = state?.orderItems?.filter(
        (item) => !listChecked?.includes(item.product), // Giữ lại những món KHÔNG nằm trong danh sách check
      );
      state.orderItems = newOrderItems;
    },
    // redux/slides/orderSlide.js
    selectedOrder: (state, action) => {
      const { listChecked = [] } = action.payload || {}; // Lọc lấy các sản phẩm có ID nằm trong danh sách đã chọn
      const orderItemsSelected = state.orderItems.filter((item) =>
        listChecked?.includes(item.product),
      );
      // Lưu danh sách đầy đủ object vào orderItemsSelected
      state.selectedItemOrders = orderItemsSelected;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  handleChangeCount,
  removeOrderProduct,
  removeManyOrderProduct,
  selectedOrder,
} = orderSlide.actions;

export default orderSlide.reducer;
