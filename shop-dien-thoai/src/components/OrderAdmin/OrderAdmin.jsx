import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { convertPrice } from "../../untils";
import TableComponent from "../TableComponent/TableComponent";
import Loading from "../LoaddingComponent/Loadding";
import * as message from "../../components/Message/Message";
import { WrapperHeader } from "../AdminUser/style";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import {
  Button,
  Checkbox,
  Space,
  Tag,
  Card,
  Col,
  Row,
  Statistic,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

function OrderAdmin() {
  const user = useSelector((state) => state.user);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [stateOrderDetails, setStateOrderDetails] = useState(null);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const queryClient = useQueryClient();

  // --- 1. QUERIES ---
  const {
    isFetching: isFetchingAllOrder,
    isLoading: isLoadingAllOrder,
    data: orders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => OrderService.getAllOrder(user.access_token),
  });

  // --- 2. LOGIC LỌC DỮ LIỆU THEO NGÀY (CHO PHẦN THỐNG KÊ) ---
  const filteredByDate = useMemo(() => {
    const allData = orders?.data || [];
    if (!dateRange || !dateRange[0] || !dateRange[1]) return allData;
    const startDate = dateRange[0].startOf("day");
    const endDate = dateRange[1].endOf("day");
    return allData.filter((order) => {
      const orderDate = dayjs(order.createdAt);
      return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
    });
  }, [orders, dateRange]);

  // --- 3. THỐNG KÊ ---
  const statistics = useMemo(() => {
    const totalOrders = filteredByDate.length;
    const validOrders = filteredByDate.filter(
      (order) => !order.isCancelled,
    ).length;
    const totalRevenue = filteredByDate
      .filter((order) => order.isPaid && !order.isCancelled)
      .reduce((sum, order) => sum + order.totalPrice, 0);
    return { totalOrders, validOrders, totalRevenue };
  }, [filteredByDate]);

  // --- 4. HANDLERS ---
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
      setIsLoadingUpdate(false);
    }
  };

  const mutationUpdateOrder = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    return OrderService.updateOrder(id, token, rests);
  });

  const handleUpdateOrder = (id) => {
    mutationUpdateOrder.mutate(
      {
        id: id,
        token: user?.access_token,
        isPaid: stateOrderDetails?.isPaid,
        isDelivered: stateOrderDetails?.isDelivered,
      },
      {
        onSuccess: () => {
          message.success("Cập nhật đơn hàng thành công!");
          setIsOpenDrawer(false);
          queryClient.invalidateQueries(["orders"]);
        },
        onError: () => message.error("Cập nhật thất bại!"),
      },
    );
  };

  // --- 5. TABLE CONFIG (WITH FILTERS) ---
  const dataTable = filteredByDate.map((order) => ({
    ...order,
    key: order._id,
    fullName: order?.shippingAddress?.fullName,
    fullAddress: `${order?.shippingAddress?.address}, ${order?.shippingAddress?.city}`,
  }));

  // Hàm tạo filter search chung
  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <InputComponent
          placeholder={placeholder}
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
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      ...getColumnSearchProps("_id", "Tìm mã đơn"),
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
      ...getColumnSearchProps("fullName", "Tìm tên khách"),
      render: (text) => (
        <span style={{ color: "#1677ff", fontWeight: "500" }}>{text}</span>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "status",
      filters: [
        { text: "Chờ xử lý", value: "processing" },
        { text: "Đã giao", value: "delivered" },
        { text: "Đã hủy", value: "cancelled" },
      ],
      onFilter: (value, record) => {
        if (value === "cancelled") return record.isCancelled;
        if (value === "delivered") return record.isDelivered;
        if (value === "processing")
          return !record.isCancelled && !record.isDelivered;
        return true;
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
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (totalPrice) => convertPrice(totalPrice),
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
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>

      <div
        style={{
          marginTop: "15px",
          marginBottom: "20px",
          background: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Space direction="vertical" size={12}>
          <span style={{ fontWeight: "500" }}>
            <CalendarOutlined /> Lọc hóa đơn theo thời gian:
          </span>
          <RangePicker
            placeholder={["Từ ngày", "Đến ngày"]}
            format="DD/MM/YYYY"
            onChange={(dates) => setDateRange(dates)}
            style={{ width: "350px" }}
          />
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: "25px" }}>
        <Col span={8}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
          >
            <Statistic
              title="Tổng số hóa đơn"
              value={statistics.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: "#1677ff" }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
          >
            <Statistic
              title="Hóa đơn thực thụ"
              value={statistics.validOrders}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
          >
            <Statistic
              title="Tổng doanh thu"
              value={statistics.totalRevenue}
              formatter={(val) => convertPrice(val)}
              prefix={<DollarCircleOutlined style={{ color: "#cf1322" }} />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      <Loading isLoading={isLoadingAllOrder || isFetchingAllOrder}>
        <TableComponent
          columns={columns}
          data={dataTable}
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
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  padding: "16px",
                  borderRadius: "8px",
                  opacity: stateOrderDetails?.isCancelled ? 0.7 : 1,
                }}
              >
                <h3 style={{ marginBottom: "15px" }}>Sản phẩm đã đặt</h3>
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
                        filter: stateOrderDetails?.isCancelled
                          ? "grayscale(1)"
                          : "none",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600" }}>{item.name}</div>
                      <div>
                        Số lượng: <b>{item.amount}</b>
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold", color: "#ff4d4f" }}>
                      {convertPrice(item.price)}
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: "right", marginTop: "15px" }}>
                  <span style={{ fontSize: "16px", marginRight: "10px" }}>
                    Tổng thanh toán:{" "}
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    background: "#fafafa",
                    padding: "16px",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ marginBottom: "12px" }}>Thông tin giao hàng</h4>
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
                </div>
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
                  <h4 style={{ marginBottom: "12px" }}>Quản lý trạng thái</h4>
                  <Checkbox
                    checked={stateOrderDetails?.isDelivered}
                    disabled={stateOrderDetails?.isCancelled}
                    onChange={(e) =>
                      setStateOrderDetails({
                        ...stateOrderDetails,
                        isDelivered: e.target.checked,
                      })
                    }
                  >
                    Xác nhận Đã giao
                  </Checkbox>
                  <Checkbox
                    checked={stateOrderDetails?.isPaid}
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
                    Xác nhận Đã thanh toán
                  </Checkbox>
                  <Button
                    type="primary"
                    block
                    style={{ marginTop: "25px" }}
                    disabled={stateOrderDetails?.isCancelled}
                    loading={mutationUpdateOrder.isLoading}
                    onClick={() => handleUpdateOrder(stateOrderDetails._id)}
                  >
                    Cập nhật
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
