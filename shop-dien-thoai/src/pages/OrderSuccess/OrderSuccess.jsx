import { Divider } from "antd";
import Loading from "../../components/LoaddingComponent/Loadding";
import { convertPrice } from "../../untils";
import {
  OrderContainer,
  OrderWrapper,
  OrderTitle,
  ContentContainer,
  WrapperInfo,
  SectionItem,
  SectionTitle,
  TextContent,
  OrderItem,
  OrderItemImg,
  OrderItemName,
  OrderItemPrice,
  OrderItemQuantity,
} from "./style";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../constant";
const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;
  return (
    <OrderContainer>
      <Loading isLoading={false}>
        <OrderWrapper>
          <OrderTitle>Đơn hàng đặt thành công</OrderTitle>

          <ContentContainer>
            <WrapperInfo>
              <SectionItem>
                <SectionTitle>Phương thức giao hàng</SectionTitle>
                <TextContent>
                  <span className="highlight">
                    {orderContant.delivery[state?.delivery]}
                  </span>
                  Giao hàng tiết kiệm
                </TextContent>
              </SectionItem>

              <Divider style={{ margin: "15px 0" }} />

              <SectionItem>
                <SectionTitle>Phương thức thanh toán</SectionTitle>
                <TextContent>
                  {orderContant.payment[state?.payment]}
                </TextContent>
              </SectionItem>

              <Divider style={{ margin: "15px 0" }} />

              {/* Danh sách sản phẩm: Ảnh -> Tên -> Giá -> Số lượng */}
              <SectionTitle>Sản phẩm đã đặt</SectionTitle>
              <div style={{ marginTop: "10px" }}>
                {state?.orders?.map((prod) => (
                  <OrderItem key={prod.product}>
                    {/* 1. Ảnh */}
                    <OrderItemImg src={prod.image} alt="product" />
                    {/* 2. Tên (Để ngay sau ảnh cho dễ nhìn) */}
                    <OrderItemName title={prod.name}>{prod.name}</OrderItemName>
                    {/* 3. Giá tiền */}
                    <OrderItemPrice>
                      <span
                        style={{
                          color: "var(--text-color)",
                          marginRight: "4px",
                        }}
                      >
                        Giá tiền:
                      </span>
                      {convertPrice(prod.price * prod.amount)}
                    </OrderItemPrice>
                    {/* 4. Số lượng */}
                    <OrderItemQuantity>
                      <span
                        style={{
                          color: "var(--text-color)",
                          marginRight: "4px",
                        }}
                      >
                        Số lượng:
                      </span>
                      {prod.amount}
                    </OrderItemQuantity>
                  </OrderItem>
                ))}
              </div>
            </WrapperInfo>
          </ContentContainer>
        </OrderWrapper>
      </Loading>
    </OrderContainer>
  );
};

export default OrderSuccess;
