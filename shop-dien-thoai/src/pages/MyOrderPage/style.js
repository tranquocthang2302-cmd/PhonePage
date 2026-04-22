import styled from "styled-components";

export const WrapperMyOrder = styled.div`
  width: 100%;
  background: #f5f5fa; /* Màu nền xám nhạt cho sạch */
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

export const WrapperContainer = styled.div`
  width: 800px;
  background: #fff;
  padding: 20px;
  border-radius: 12px; /* Bo góc nhiều hơn cho hiện đại */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Đổ bóng mịn */
  margin-bottom: 20px;
  transition: transform 0.2s;
  border: 1px solid var(--border-color);

  &:hover {
    transform: translateY(-2px); /* Hiệu ứng bay nhẹ khi di chuột */
  }
`;

export const WrapperState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .status-header {
    font-weight: 600;
    font-size: 1.6rem;
    color: #242424;
  }

  .status-tags {
    display: flex;
    gap: 20px;
    align-items: center;
  }
`;

export const WrapperPay = styled.div`
  font-size: 1.4rem;
  color: #555;
  display: flex;
  align-items: center;

  gap: 5px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  .item-info {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 70%;
  }

  .product-img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border: 1px solid #eee;
    border-radius: 6px;
  }

  .product-name {
    font-size: 1.4rem;
    color: #242424;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .item-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .price {
      font-size: 1.5rem;
      color: #242424;
    }
    .amount {
      font-size: 1.3rem;
      color: #888;
    }
  }
`;

export const WrapperFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;

  .total-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .total-label {
    font-size: 1.4rem;
    color: #555;
  }

  .total-price {
    font-size: 1.8rem;
    color: #ff424e;
    font-weight: 700;
  }

  .button-group {
    display: flex;
  }
`;
