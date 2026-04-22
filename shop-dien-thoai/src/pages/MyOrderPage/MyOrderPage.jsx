import { Tabs, Tag } from "antd"; // Import thêm Tag

import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoaddingComponent/Loadding";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { convertPrice } from "../../untils"; // Điều chỉnh đường dẫn cho đúng với cấu trúc thư mục của Thắng
import * as message from "../../components/Message/Message";
import * as ProductService from "../../services/ProductService";

import {
  WrapperContainer,
  WrapperFooter,
  WrapperItemOrder,
  WrapperMyOrder,
  WrapperPay,
  WrapperState,
} from "./style";

import { Divider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHook } from "../../hooks/useMutationHook";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addOrderProduct } from "../../redux/slides/orderSlide";

const OrderPage = () => {
  const queryClient = useQueryClient(); // 1. Khởi tạo queryClient
  const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);
  const [orderCancelId, setOrdercancelId] = useState("");
  const dispatch = useDispatch();
  //Logic tabActive
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();
  const { state } = location;
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(
      state?.id,
      state?.access_token,
    );
    return res.data;
  };
  const {
    isFetching,
    isLoading,
    data: orders,
  } = useQuery({
    queryKey: ["orders", state?.id],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.access_token),
  });

  // 2. Danh sách các Tab hiển thị trên màn hình
  const items = [
    { key: "all", label: "Tất cả đơn" },
    { key: "processing", label: "Chờ xử lý" },
    { key: "delivered", label: "Đã giao" },
    { key: "cancelled", label: "Đã hủy" },
  ];
  const renderOrders = (tabKey) => {
    if (!orders) return [];

    switch (tabKey) {
      case "processing": // Đơn chưa giao và chưa hủy
        return orders.filter(
          (order) => !order.isDelivered && !order.isCancelled,
        );
      case "delivered": // Đơn đã giao thành công
        return orders.filter((order) => order.isDelivered);
      case "cancelled": // Đơn đã bị hủy
        return orders.filter((order) => order.isCancelled);
      default: // Tab 'all' - Hiện tất cả
        return orders;
    }
  };

  const navigate = useNavigate();

  const handleOrderDetial = (id) => {
    navigate(`/detail-order/${id}`, {
      state: {
        access_token: state?.access_token,
      },
    });
  };

  //Xử lý huỷ đơn hàng
  const mutationCancelOrder = useMutationHook((data) => {
    const { id, token } = data;
    return OrderService.cancelOrder(id, token);
  });
  const { isPending: isPendingCancel } = mutationCancelOrder;
  const handleConfirmCancel = () => {
    mutationCancelOrder.mutate(
      { id: orderCancelId, token: state?.access_token },
      {
        onSuccess: (res) => {
          if (res?.status === "OK") {
            setIsOpenModalCancel(false);
            queryClient.invalidateQueries(["orders", state?.id]);
            message.success("Hủy đơn hàng thành công");
          } else {
            message.error(res?.message || "Có lỗi xảy ra");
          }
        },
        onError: () => {
          message.error("Lỗi hệ thống, vui lòng thử lại sau");
        },
      },
    );
  };
  const handleOpenModalCancel = (id) => {
    setIsOpenModalCancel(true);
    setOrdercancelId(id);
  };
  const handleReOrder = async (orderItems) => {
    try {
      // 1. Duyệt qua mảng orderItems để lấy thông tin mới nhất của từng Product từ Database
      const itemsToRedux = await Promise.all(
        orderItems.map(async (item) => {
          // Gọi API lấy chi tiết sản phẩm dựa vào product (đây là ID)
          const res = await ProductService.getDetailProduct(item?.product);
          const productDetail = res?.data;
          console.log("productDetail", productDetail);
          return {
            name: item?.name,
            amount: item?.amount,
            image: item?.image,
            price: item?.price,
            product: item?.product,
            // Lấy countInStock mới nhất từ database
            countInStock: productDetail?.countInStock || 0,
            user: state?.id,
          };
        }),
      );

      itemsToRedux.forEach((orderItem) => {
        dispatch(addOrderProduct({ orderItem }));
      });

      message.success("Đã thêm sản phẩm vào giỏ hàng");
      navigate("/order");
    } catch (e) {
      console.error("Lỗi khi mua lại:", e);
      message.error("Không thể lấy thông tin sản phẩm, vui lòng thử lại sau");
    }
  };
  return (
    <Loading isLoading={isLoading || isFetching}>
      <WrapperMyOrder>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "20px",
            width: "800px",
          }}
        >
          Đơn hàng của tôi
        </h1>
        <Tabs
          defaultActiveKey="all"
          items={items}
          onChange={(key) => setActiveTab(key)}
          style={{
            marginBottom: "20px",
            background: "#fff",
            padding: "10px",
            borderRadius: "8px",
          }}
        />
        {renderOrders(activeTab)?.map((order) => {
          return (
            <WrapperContainer
              key={order?._id}
              style={{ opacity: order?.isCancelled ? 0.8 : 1 }}
            >
              <WrapperState>
                <div className="status-header">
                  <span className="label">Trạng thái</span>
                </div>
                <div className="status-tags">
                  <WrapperPay>
                    <WrapperPay>
                      Giao hàng:
                      {order?.isDelivered ? (
                        <Tag color="success">Đã giao</Tag>
                      ) : (
                        <Tag color="warning">
                          {order?.isCancelled ? "Ngừng xử lý" : "Đang xử lý"}
                        </Tag>
                      )}
                      {order?.isCancelled && (
                        <Tag color="red">Đơn hàng đã hủy</Tag>
                      )}
                    </WrapperPay>
                  </WrapperPay>
                  <WrapperPay>
                    Thanh toán:
                    {order?.isPaid ? (
                      <Tag color="blue">Đã thanh toán</Tag>
                    ) : (
                      <Tag color="error">Chưa thanh toán</Tag>
                    )}
                  </WrapperPay>
                </div>
              </WrapperState>

              <Divider style={{ margin: "12px 0" }} />

              {order?.orderItems?.map((orderItem) => {
                return (
                  <WrapperItemOrder key={orderItem?._id}>
                    <div className="item-info">
                      <img
                        src={orderItem?.image}
                        alt={orderItem?.name}
                        className="product-img"
                      />
                      <div className="product-name">{orderItem?.name}</div>
                    </div>
                    <div className="item-price">
                      <span className="price">
                        {convertPrice(orderItem?.price)}
                      </span>
                      <span className="amount">x {orderItem?.amount}</span>
                    </div>
                  </WrapperItemOrder>
                );
              })}

              <Divider style={{ margin: "12px 0" }} />

              <WrapperFooter>
                <div className="total-container">
                  <span className="total-label">Tổng tiền:</span>
                  <span className="total-price">
                    {convertPrice(order?.totalPrice)}
                  </span>
                </div>
                <div className="button-group">
                  {(order?.isDelivered || order?.isCancelled) && (
                    <ButtonComponent
                      styleButton={{
                        border: "1px solid #1890ff",
                        borderRadius: "4px",
                        background: "var(--primary-color)",
                        opacity: 1,
                      }}
                      onClick={() => handleReOrder(order?.orderItems)}
                    >
                      <span style={{ color: "#fff" }}>Mua lại</span>
                    </ButtonComponent>
                  )}
                  {!order?.isCancelled && !order?.isDelivered && (
                    <ButtonComponent
                      styleButton={{
                        border: "1px solid #ff4d4f",
                        borderRadius: "4px",
                      }}
                      onClick={() => handleOpenModalCancel(order?._id)}
                    >
                      <span style={{ color: "#ff4d4f" }}>Huỷ đơn hàng</span>
                    </ButtonComponent>
                  )}
                  <ButtonComponent
                    styleButton={{
                      border: "1px solid #1890ff",
                      marginLeft: "12px",
                      borderRadius: "4px",
                    }}
                    onClick={() => {
                      handleOrderDetial(order?._id);
                    }}
                  >
                    <span style={{ color: "#1890ff" }}>Xem chi tiết</span>
                  </ButtonComponent>
                </div>
              </WrapperFooter>
            </WrapperContainer>
          );
        })}
        <ModalComponent
          forceRender
          title="Xác nhận huỷ"
          isOpen={isOpenModalCancel}
          onCancel={() => {
            setIsOpenModalCancel(false);
          }}
          onOk={handleConfirmCancel}
          confirmLoading={isPendingCancel}
        >
          <Loading isLoading={isPendingCancel}>
            <div>Bạn có chắc chắn muốn huỷ đơn hàng này không?</div>
          </Loading>
        </ModalComponent>
      </WrapperMyOrder>
    </Loading>
  );
};

export default OrderPage;
