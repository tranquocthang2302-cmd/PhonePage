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
  font-weight: 500;
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
  flex-shrink: 0;
`;

export const OrderHeader = styled.div`
  background: #fff;
  padding: 10px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 500;
`;

// Sửa từ styled(Checkbox) thành styled.div để làm thẻ bọc
export const HeaderCheckbox = styled.div`
  width: 35%;
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
`;

export const OrderItemList = styled.div`
  background: #fff;
  border-radius: 4px;
`;

export const OrderItem = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

export const OrderItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 35%;
`;

export const OrderItemImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

export const OrderItemName = styled.div`
  font-size: 14px;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const OrderItemPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const PriceCurrent = styled.span`
  font-weight: 500;
  font-size: 14px;
`;

export const PriceOld = styled.span`
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
`;

export const OrderItemQuantity = styled.div`
  display: flex;
  justify-content: center;
`;

export const OrderItemTotal = styled.div`
  color: #ff424e;
  font-weight: 500;
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
  margin-bottom: 8px;
  font-size: 13px;
`;

export const SummaryTotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const TotalLabel = styled.div`
  font-size: 16px;
`;

export const TotalValue = styled.div`
  text-align: right;
`;

export const TotalAmount = styled.div`
  color: #ff424e;
  font-size: 24px;
  font-weight: 600;
`;

export const TotalVAT = styled.span`
  font-size: 11px;
  color: #808089;
`;

export const BtnOrderSubmit = styled.button`
  width: 100%;
  height: 48px;
  background: #ff424e;
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #d7323d;
  }
`;
export const WrapperAddress = styled.div(``);
