import styled from "styled-components";

export const OrderContainer = styled.div`
  background: #f5f5fa;
  width: 100%;
  min-height: 100vh;
  padding: 20px 0;
`;

export const OrderWrapper = styled.div`
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
`;

export const OrderTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
  color: #242424;
`;

export const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const WrapperInfo = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 6px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const SectionItem = styled.div`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 12px;
  color: #242424;
`;

export const TextContent = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  line-height: 1.6;

  .highlight {
    color: #ea8500;
    font-weight: bold;
    margin-right: 8px;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin: 20px 0;
`;

// --- STYLE DANH SÁCH SẢN PHẨM ---
export const OrderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
  &:last-child {
    border-bottom: none;
  }
`;

export const OrderItemImg = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
  flex-shrink: 0;
`;

export const OrderItemName = styled.div`
  width: 45%; /* Cột tên chiếm 45% */
  font-size: 14px;
  color: #242424;
  line-height: 1.4;
  padding: 0 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const OrderItemPrice = styled.div`
  width: 30%; /* Cột giá chiếm 30% */
  color: #ff424e;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
`;

export const OrderItemQuantity = styled.div`
  width: 15%; /* Cột số lượng chiếm 15% */
  text-align: right;
  font-size: 14px;
  color: var(--text-color);
`;
