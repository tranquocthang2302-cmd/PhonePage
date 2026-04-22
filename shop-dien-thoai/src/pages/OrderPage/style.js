import styled from "styled-components";

export const OrderContainer = styled.div`
  background-color: #f5f5fa;
  width: 100%;
  min-height: 100vh;
  padding: 20px 0;
`;

export const OrderWrapper = styled.div`
  width: 1270px;
  margin: 0 auto;
`;

export const OrderTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

export const ColLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ColRight = styled.div`
  width: 320px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OrderHeader = styled.div`
  background: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 14px;
  color: #333;

  /* Căn chỉnh các cột header */
  .name {
    width: 40%;
    display: flex;
    align-items: center;
  }
  .price {
    width: 20%;
    text-align: center;
  }
  .quantity {
    width: 15%;
    text-align: center;
  }
  .total {
    width: 20%;
    text-align: center;
  }
  .action {
    width: 5%;
    text-align: right;
  }
`;

export const OrderPriceDelivery = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 12px;
  width: 100%;
`;

export const HeaderCheckbox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  .ant-checkbox-wrapper {
    margin-right: 8px;
  }
`;

export const OrderItemList = styled.div`
  background: #fff;
  border-radius: 4px;
`;

export const OrderItem = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

export const OrderItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 40%; /* Khớp với header .name */
`;

export const OrderItemImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
`;

export const OrderItemName = styled.div`
  font-size: 14px;
  color: #242424;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-right: 10px;
`;

export const OrderItemPrice = styled.div`
  width: 20%; /* Khớp với header .price */
  text-align: center;
`;

export const PriceCurrent = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #242424;
`;

export const OrderItemQuantity = styled.div`
  width: 15%; /* Khớp với header .quantity */
  display: flex;
  justify-content: center;

  .ant-input-number {
    width: 60px;
  }
`;

export const OrderItemTotal = styled.div`
  width: 20%; /* Khớp với header .total */
  text-align: center;
  color: #ff424e;
  font-weight: 600;
  font-size: 14px;
`;

export const OrderSummary = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 4px;
`;

export const SummaryInfo = styled.div`
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 12px;
`;

export const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
  &.address-line {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
`;

export const WrapperAddress = styled.div`
  font-weight: 500;
  color: #242424;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const SummaryTotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const TotalLabel = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: #333;
`;

export const TotalValue = styled.div`
  text-align: right;
`;

export const TotalAmount = styled.div`
  color: #ff424e;
  font-size: 22px;
  font-weight: 700;
`;

export const TotalVAT = styled.div`
  font-size: 11px;
  color: #808089;
  margin-top: 4px;
`;

export const BtnOrderSubmit = styled.button`
  width: 100%;
  height: 42px;
  background: #ff424e;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;
