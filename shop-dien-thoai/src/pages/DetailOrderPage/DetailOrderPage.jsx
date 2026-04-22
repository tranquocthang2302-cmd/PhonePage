import { Divider, Tag, message } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BankOutlined,
  DollarOutlined,
  TagOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import React from "react";
import {
  WrapperDetailPage,
  DetailPageTitle,
  OrderHeaderBlock,
  OrderHeaderLeft,
  StatusGroup,
  StatusItem,
  InfoGrid,
  InfoBlock,
  BlockTitle,
  BlockContent,
  AddressContent,
  ProductListBlock,
  ProductTableHeader,
  ProductTableBody,
  ProductRow,
  ProductImage,
  ProductInfo,
  ProductPrice,
  SummaryBlock,
  SummaryLine,
  TotalPriceLine,
} from "./style";
import { useLocation, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { convertPrice } from "../../untils";
import { orderContant } from "../../constant";
import Loading from "../../components/LoaddingComponent/Loadding";

const DetailOrderPage = () => {
  const param = useParams();
  const location = useLocation();
  const { state } = location;

  const fetchOrderDetail = async () => {
    const res = await OrderService.getOrderbyOrderId(
      param.id,
      state?.access_token,
    );
    return res.data;
  };

  const { isFetching, isLoading, data } = useQuery({
    queryKey: ["order", param.id],
    queryFn: fetchOrderDetail,
    enabled: !!(param.id && state?.access_token),
  });

  const shippingAddress = data?.shippingAddress || {};
  const orderItems = data?.orderItems || [];

  // Tạo mã đơn hàng theo định dạng: #WTS + 6 ký tự cuối ID viết hoa
  const renderOrderCode = (id) => {
    return id ? `#WTS${id.slice(-6).toUpperCase()}` : "";
  };

  // Hàm copy mã đơn hàng mới
  const handleCopyId = () => {
    const customId = renderOrderCode(data?._id);
    if (customId) {
      navigator.clipboard.writeText(customId);
      message.success(`Đã sao chép mã đơn hàng: ${customId}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading || isFetching || !data) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading isLoading={true} />
      </div>
    );
  }

  return (
    <Loading isLoading={isLoading || isFetching}>
      <WrapperDetailPage>
        {/* Tiêu đề chính & Hiển thị Mã đơn hàng tùy chỉnh */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <DetailPageTitle style={{ margin: 0 }}>
            Chi tiết đơn hàng
          </DetailPageTitle>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.4rem", color: "#888" }}>
              Mã đơn hàng:
            </span>
            <Tag
              color="blue"
              style={{
                fontSize: "1.4rem",
                padding: "4px 12px",
                fontWeight: "bold",
                cursor: "pointer",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
              onClick={handleCopyId}
              title="Click để sao chép mã đơn"
            >
              {renderOrderCode(data?._id)} <CopyOutlined />
            </Tag>
          </div>
        </div>

        {/* Khối Header (Ngày đặt và Trạng thái) */}
        <OrderHeaderBlock>
          <OrderHeaderLeft>
            <CalendarOutlined
              style={{ fontSize: "1.6rem", color: "#1890ff" }}
            />
            <span style={{ fontSize: "1.4rem", color: "#555" }}>
              Ngày đặt hàng:{" "}
              <strong style={{ color: "#333" }}>
                {formatDate(data?.createdAt)}
              </strong>
            </span>
          </OrderHeaderLeft>
          <StatusGroup>
            <StatusItem>
              <span className="status-label">Thanh toán:</span>
              {data?.isPaid ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Đã thanh toán
                </Tag>
              ) : (
                <Tag icon={<ExclamationCircleOutlined />} color="warning">
                  Chưa thanh toán
                </Tag>
              )}
            </StatusItem>
            <StatusItem>
              <span className="status-label">Giao hàng:</span>
              {data?.isDelivered ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Đã giao hàng
                </Tag>
              ) : (
                <Tag icon={<ExclamationCircleOutlined />} color="warning">
                  Chưa giao hàng
                </Tag>
              )}
            </StatusItem>
          </StatusGroup>
        </OrderHeaderBlock>

        {/* Khối Grid thông tin */}
        <InfoGrid>
          <InfoBlock>
            <BlockTitle>
              <EnvironmentOutlined />
              <span>ĐỊA CHỈ NGƯỜI NHẬN</span>
            </BlockTitle>
            <BlockContent>
              <strong style={{ fontSize: "1.6rem", color: "#333" }}>
                {shippingAddress?.fullName}
              </strong>
              <AddressContent>
                <div className="address-line">
                  {shippingAddress?.address}, {shippingAddress?.city}
                </div>
                <div className="phone-line">
                  Điện thoại: (+84) {shippingAddress?.phone}
                </div>
              </AddressContent>
            </BlockContent>
          </InfoBlock>

          <InfoBlock>
            <BlockTitle>
              <TagOutlined />
              <span>HÌNH THỨC GIAO HÀNG</span>
            </BlockTitle>
            <BlockContent>
              <span
                style={{
                  color: "#ea8500",
                  fontWeight: "bold",
                  marginRight: "4px",
                }}
              >
                {orderContant.delivery[data?.shippingMethod]}
              </span>
              <span>Giao hàng tiết kiệm</span>
              <div
                style={{ marginTop: "10px", color: "#555", fontSize: "1.4rem" }}
              >
                Phí giao hàng:{" "}
                <strong style={{ color: "#333" }}>
                  {convertPrice(data?.shippingPrice)}
                </strong>
              </div>
            </BlockContent>
          </InfoBlock>

          <InfoBlock>
            <BlockTitle>
              <BankOutlined />
              <span>HÌNH THỨC THANH TOÁN</span>
            </BlockTitle>
            <BlockContent>
              <div>{orderContant.payment[data?.paymentMethod]}</div>
            </BlockContent>
          </InfoBlock>
        </InfoGrid>

        {/* Danh sách sản phẩm */}
        <ProductListBlock>
          <ProductTableHeader>
            <div className="col-product">Sản phẩm</div>
            <div className="col-price">Giá</div>
            <div className="col-quantity">Số lượng</div>
            <div className="col-total">Tạm tính</div>
          </ProductTableHeader>
          <ProductTableBody>
            {orderItems?.map((item) => {
              const tempPrice = item?.price * item?.amount;
              return (
                <ProductRow key={item?._id}>
                  <div className="col-product">
                    <ProductImage src={item?.image} alt={item?.name} />
                    <ProductInfo>
                      <div className="product-name">{item?.name}</div>
                      {/* Cập nhật mã SP đồng nhất 6 ký tự */}
                      <div className="product-id">
                        Mã SP: {item?.product?.slice(-6).toUpperCase()}
                      </div>
                    </ProductInfo>
                  </div>
                  <div className="col-price">
                    <ProductPrice>{convertPrice(item?.price)}</ProductPrice>
                  </div>
                  <div className="col-quantity">
                    <div className="quantity-badge">{item?.amount}</div>
                  </div>
                  <div className="col-total">
                    <ProductPrice className="final">
                      {convertPrice(tempPrice)}
                    </ProductPrice>
                  </div>
                </ProductRow>
              );
            })}
          </ProductTableBody>
        </ProductListBlock>

        {/* Tổng kết đơn hàng */}
        <SummaryBlock>
          <SummaryLine>
            <span>Tạm tính (Tất cả sản phẩm)</span>
            <span>{convertPrice(data?.itemsPrice)}</span>
          </SummaryLine>
          <SummaryLine>
            <span>Phí vận chuyển</span>
            <span>{convertPrice(data?.shippingPrice)}</span>
          </SummaryLine>
          <Divider style={{ margin: "15px 0" }} />
          <TotalPriceLine>
            <DollarOutlined />
            <span>TỔNG CỘNG</span>
            <div className="total-price">{convertPrice(data?.totalPrice)}</div>
          </TotalPriceLine>
        </SummaryBlock>
      </WrapperDetailPage>
    </Loading>
  );
};

export default DetailOrderPage;
