// --- 1. IMPORTS ---

import { useQuery, useQueryClient } from "@tanstack/react-query";

import * as OrderService from "../../services/OrderService";
import { convertPrice } from "../../untils";

import TableComponent from "../TableComponent/TableComponent";

import Loading from "../LoaddingComponent/Loadding";
import * as message from "../../components/Message/Message";

import { WrapperHeader } from "../AdminUser/style";

import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Button, Checkbox, Space, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import { useMutationHook } from "../../hooks/useMutationHook";

function OrderAdmin() {
  const user = useSelector((state) => state.user);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [stateOrderDetails, setStateOrderDetails] = useState(null);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const queryClient = useQueryClient();
  // --- 2. QUERIES ---
  const {
    isFetching: isFetchingAllOrder,
    isLoading: isLoadingAllOrder,
    data: orders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => OrderService.getAllOrder(user.access_token),
  });

  const handleDetailOrder = async (id) => {
    setRowSelected(id);
    setIsLoadingUpdate(true);
    try {
      const res = await OrderService.getOrderbyOrderId(id, user?.access_token);
      if (res?.data) {
        setStateOrderDetails(res?.data);
        setIsOpenDrawer(true);
      }
    } catch (error) {
      message.error("Không thể lấy thông tin đơn hàng!");
    } finally {
      setIsLoadingUpdate(false); // Tắt loading dù thành công hay thất bại
    }
  };

  const mutationUpdateOrder = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    OrderService.updateOrder(id, token, rests);
  });
  const handleUpdateOrder = (id) => {
    mutationUpdateOrder.mutate(
      {
        id: id,
        token: user?.access_token,
        // Bổ sung dữ liệu từ state của Drawer vào đây
        isPaid: stateOrderDetails?.isPaid,
        isDelivered: stateOrderDetails?.isDelivered,
      },
      {
        onSuccess: () => {
          message.success("Cập nhật đơn hàng thành công!");
          setIsOpenDrawer(false);
          // Dùng queryClient (chữ q viết thường) để load lại bảng
          queryClient.invalidateQueries(["orders"]);
        },
        onError: () => {
          message.error("Cập nhật thất bại!");
        },
      },
    );
  };
  const dataTable =
    orders?.data?.map((order) => ({
      ...order,
      key: order._id,
      fullName: order?.shippingAddress?.fullName,
      phone: order?.shippingAddress.phone,
      address: order?.shippingAddress.address,
      fullAddress: `${order?.shippingAddress?.address}, ${order?.shippingAddress?.city}`,
    })) || [];
  // --- 6. TABLE CONFIG ---
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      // Tạo ô nhập để tìm kiếm
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <InputComponent
            placeholder="Tìm mã đơn (vd: B3C4D5)"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        const orderCode = `#WTS${record._id.slice(-6).toUpperCase()}`;
        return orderCode.toLowerCase().includes(value.toLowerCase());
      },
      render: (id) => (
        <span style={{ fontWeight: "bold", color: "#555" }}>
          #WTS{id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      render: (text) => (
        <span style={{ color: "#1677ff", fontWeight: "500" }}>{text}</span>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),

      // Tự định nghĩa giao diện lọc để đổi Placeholder
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        // Lấy danh sách tên không trùng
        const names = Array.from(
          new Set(dataTable.map((item) => item.fullName)),
        ).filter((n) => n);

        return (
          <div style={{ padding: 8 }}>
            <InputComponent
              placeholder="Tìm tên khách hàng" // Đây là chỗ Thắng muốn sửa
              value={selectedKeys[0]}
              onChange={(e) => {
                // Khi nhập vào ô search, Antd sẽ hiểu là đang lọc
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8, display: "block" }}
            />
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                marginBottom: "8px",
              }}
            >
              {names
                .filter(
                  (name) =>
                    !selectedKeys[0] ||
                    name.toLowerCase().includes(selectedKeys[0].toLowerCase()),
                )
                .map((name) => (
                  <div key={name} style={{ padding: "4px 0" }}>
                    <Checkbox
                      checked={selectedKeys.includes(name)}
                      onChange={(e) => {
                        const nextKeys = e.target.checked
                          ? [...selectedKeys, name]
                          : selectedKeys.filter((k) => k !== name);
                        setSelectedKeys(nextKeys);
                      }}
                    >
                      {name}
                    </Checkbox>
                  </div>
                ))}
            </div>
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90 }}
              >
                Lọc
              </Button>
              <Button
                onClick={() => clearFilters()}
                size="small"
                style={{ width: 90 }}
              >
                Xóa
              </Button>
            </Space>
          </div>
        );
      },
      onFilter: (value, record) => record.fullName.includes(value),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => new Date(date).toLocaleString("vi-VN"), // Định dạng ngày Việt Nam
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "fullAddress",
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "status",
      filters: [
        { text: "Đã hủy", value: "cancelled" },
        { text: "Đã giao", value: "delivered" },
        { text: "Chờ xử lý", value: "processing" },
      ],
      onFilter: (value, record) => {
        if (value === "cancelled") return record.isCancelled;
        if (value === "delivered") return record.isDelivered;
        if (value === "processing")
          return !record.isCancelled && !record.isDelivered;
      },
      render: (_, record) => {
        if (record.isCancelled) return <Tag color="red">Đã hủy</Tag>;
        if (record.isDelivered) return <Tag color="green">Đã giao</Tag>;
        return <Tag color="blue">Chờ xử lý</Tag>;
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      filters: [
        { text: "Đã thanh toán", value: true },
        { text: "Chưa thanh toán", value: false },
      ],
      onFilter: (value, record) => record.isPaid === value,
      render: (isPaid) => (
        <Tag color={isPaid ? "cyan" : "volcano"}>
          {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },

    {
      title: "Phương thức giao hàng",
      dataIndex: "paymentMethod",
      render: (payment) => {
        if (payment === "later") {
          return "Thanh toán tiền mặt";
        }
        if (payment === "paypal") {
          return "Thanh toán qua PayPal";
        }
        return payment; // Trả về giá trị gốc nếu không khớp (đề phòng dữ liệu lạ)
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (totalPrice) => {
        return convertPrice(totalPrice);
      },
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_, record) => (
        <div
          style={{ cursor: "pointer", color: "#1677ff" }}
          onClick={() => handleDetailOrder(record._id)}
        >
          Xem chi tiết
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <WrapperHeader>Quản lí đơn hàng</WrapperHeader>
      <Loading isLoading={isLoadingAllOrder || isFetchingAllOrder}>
        <TableComponent
          columns={columns}
          data={dataTable}
          // rowSelection={{
          //   selectedRowKeys: listIdsSelected,
          //   onChange: (keys) => setListIdsSelected(keys),
          // }}
          pagination={{ pageSize: 5 }}
        />
      </Loading>
      <DrawerComponent
        title={`Chi tiết đơn hàng: #WTS${rowSelected?.slice(-6).toUpperCase()}`}
        isOpen={isOpenDrawer}
        onClose={() => {
          setIsOpenDrawer(false);
          setStateOrderDetails(null);
        }}
        width="60%"
      >
        <Loading isLoading={isLoadingUpdate}>
          {stateOrderDetails && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "25px" }}
            >
              {/* 1. Danh sách sản phẩm */}
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  opacity: stateOrderDetails?.isCancelled ? 0.7 : 1, // Làm mờ nhẹ nếu đơn bị hủy
                }}
              >
                <h3
                  style={{
                    marginBottom: "15px",
                    display: "inline-block",
                  }}
                >
                  Sản phẩm đã đặt
                </h3>
                {stateOrderDetails?.orderItems?.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                      gap: "15px",
                      paddingBottom: "10px",
                      borderBottom: "1px dashed #eee",
                    }}
                  >
                    <img
                      src={item.image}
                      alt="product"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #eee",
                        filter: stateOrderDetails?.isCancelled
                          ? "grayscale(1)"
                          : "none", // Đơn hủy thì ảnh xám
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#333",
                          fontSize: "15px",
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ color: "#888" }}>
                        Số lượng: <b style={{ color: "#000" }}>{item.amount}</b>
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#ff4d4f",
                        fontSize: "16px",
                      }}
                    >
                      {convertPrice(item.price)}
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: "right", marginTop: "15px" }}>
                  <span style={{ fontSize: "16px", marginRight: "10px" }}>
                    Tổng thanh toán:
                  </span>
                  <span
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: "#ff4d4f",
                    }}
                  >
                    {convertPrice(stateOrderDetails?.totalPrice)}
                  </span>
                </div>
              </div>

              {/* 2. Thông tin khách hàng & Trạng thái */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                {/* Cột trái: Thông tin nhận hàng */}
                <div
                  style={{
                    background: "#fafafa",
                    padding: "16px",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ marginBottom: "12px", color: "#555" }}>
                    Thông tin giao hàng
                  </h4>
                  <div style={{ lineHeight: "2" }}>
                    <p>
                      <b>Khách hàng:</b>{" "}
                      {stateOrderDetails?.shippingAddress?.fullName}
                    </p>
                    <p>
                      <b>Điện thoại:</b>{" "}
                      {stateOrderDetails?.shippingAddress?.phone}
                    </p>
                    <p>
                      <b>Địa chỉ:</b>{" "}
                      {stateOrderDetails?.shippingAddress?.address},{" "}
                      {stateOrderDetails?.shippingAddress?.city}
                    </p>
                    <p>
                      <b>Phương thức:</b>{" "}
                      <Tag
                        color={
                          stateOrderDetails?.paymentMethod === "paypal"
                            ? "gold"
                            : "blue"
                        }
                      >
                        {stateOrderDetails?.paymentMethod === "later"
                          ? "Thanh toán tiền mặt"
                          : "Thanh toán qua PayPal"}
                      </Tag>
                    </p>
                    {stateOrderDetails?.isCancelled && (
                      <p>
                        <b>Trạng thái:</b> <Tag color="red">ĐÃ HỦY ĐƠN</Tag>
                      </p>
                    )}
                  </div>
                </div>

                {/* Cột phải: Cập nhật trạng thái */}
                <div
                  style={{
                    background: stateOrderDetails?.isCancelled
                      ? "#fff1f0"
                      : "#f0f7ff",
                    padding: "16px",
                    borderRadius: "8px",
                    border: stateOrderDetails?.isCancelled
                      ? "1px solid #ffa39e"
                      : "1px solid #d6e4ff",
                  }}
                >
                  <h4
                    style={{
                      marginBottom: "12px",
                      color: stateOrderDetails?.isCancelled
                        ? "#cf1322"
                        : "#003a8c",
                    }}
                  >
                    {stateOrderDetails?.isCancelled
                      ? "Đơn hàng đã bị hủy"
                      : "Quản lý trạng thái"}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <Checkbox
                      checked={stateOrderDetails?.isDelivered}
                      disabled={stateOrderDetails?.isCancelled} // Khóa nếu đơn đã hủy
                      onChange={(e) =>
                        setStateOrderDetails({
                          ...stateOrderDetails,
                          isDelivered: e.target.checked,
                        })
                      }
                    >
                      Xác nhận <b>Đã giao hàng</b>
                    </Checkbox>

                    <Checkbox
                      checked={stateOrderDetails?.isPaid}
                      // Khóa nếu đơn đã hủy HOẶC thanh toán qua PayPal
                      disabled={
                        stateOrderDetails?.isCancelled ||
                        stateOrderDetails?.paymentMethod === "paypal"
                      }
                      onChange={(e) =>
                        setStateOrderDetails({
                          ...stateOrderDetails,
                          isPaid: e.target.checked,
                        })
                      }
                    >
                      Xác nhận <b>Đã thanh toán</b>
                      {stateOrderDetails?.paymentMethod === "paypal" &&
                        !stateOrderDetails?.isCancelled && (
                          <div
                            style={{
                              color: "#52c41a",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            (Đã xác thực tự động qua PayPal)
                          </div>
                        )}
                    </Checkbox>
                  </div>

                  {stateOrderDetails?.isCancelled && (
                    <div
                      style={{
                        marginTop: "15px",
                        color: "#ff4d4f",
                        fontSize: "13px",
                        fontStyle: "italic",
                      }}
                    >
                      * Đơn hàng này không thể cập nhật vì đã bị khách hàng hoặc
                      hệ thống hủy.
                    </div>
                  )}

                  <Button
                    type="primary"
                    block
                    size="large"
                    danger={stateOrderDetails?.isCancelled}
                    style={{ marginTop: "25px", fontWeight: "600" }}
                    disabled={stateOrderDetails?.isCancelled} // Không cho bấm nút Lưu nếu đơn đã hủy
                    loading={mutationUpdateOrder.isLoading}
                    onClick={() => {
                      handleUpdateOrder(stateOrderDetails._id);
                    }}
                  >
                    {stateOrderDetails?.isCancelled
                      ? "Đơn hàng đã hủy"
                      : "Cập nhật đơn hàng"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Loading>
      </DrawerComponent>
    </div>
  );
}

export default OrderAdmin;
