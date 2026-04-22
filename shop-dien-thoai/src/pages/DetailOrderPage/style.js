import styled from "styled-components";

export const WrapperDetailPage = styled.div`
  width: 1200px;
  margin: 20px auto;
  font-family: "Roboto", sans-serif;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  background: white;
  boxshadow: "rgba(0, 0, 0, 0.13) 0px 3px 12px";
`;

export const DetailPageTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

export const OrderHeaderBlock = styled.div`
  background: var(--white-color);
  padding: 15px 20px;
  border-radius: 8px; /* Bo góc khối */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); /* Đổ bóng nhẹ cho đẹp */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const OrderHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatusGroup = styled.div`
  display: flex;
  gap: 15px;
`;

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .status-label {
    font-size: 1.4rem;
    color: #555;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

export const InfoBlock = styled.div`
  background: var(--white-color);
  padding: 20px;
  border-radius: 8px; /* Bo góc khối */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const BlockTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

export const BlockContent = styled.div`
  font-size: 1.4rem;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AddressContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;

  .address-line {
    color: #555;
  }

  .phone-line {
    color: #888;
    font-size: 1.3rem;
  }
`;

export const ProductListBlock = styled.div`
  background: var(--white-color);
  border-radius: 8px; /* Bo góc khối */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden; /* Để bo góc header của bảng */
  margin-bottom: 20px;
`;

export const ProductTableHeader = styled.div`
  background: #fafafa;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 1.4rem;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #eee;

  .col-product {
    width: 50%;
  }
  .col-price {
    width: 15%;
    text-align: right;
  }
  .col-quantity {
    width: 10%;
    text-align: center;
  }
  .col-discount {
    width: 10%;
    text-align: center;
  }
  .col-total {
    width: 15%;
    text-align: right;
  }
`;

export const ProductTableBody = styled.div`
  padding: 0 20px;
`;

export const ProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .col-product {
    width: 50%;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .col-price {
    width: 15%;
    text-align: right;
  }
  .col-quantity {
    width: 10%;
    text-align: center;
  }
  .col-discount {
    width: 10%;
    text-align: center;
  }
  .col-total {
    width: 15%;
    text-align: right;
  }
`;

export const ProductImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px; /* Bo góc ảnh */
  border: 1px solid #eee;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .product-name {
    font-size: 1.5rem;
    color: #333;
    font-weight: 500;
  }

  .product-id {
    color: #888;
    font-size: 1.3rem;
  }
`;

export const ProductPrice = styled.div`
  font-size: 1.4rem;
  color: #333;

  &.final {
    font-weight: 600;
    color: var(--primary-color);
  }
`;

export const SummaryBlock = styled.div`
  background: var(--white-color);
  padding: 20px 25px;
  border-radius: 8px; /* Bo góc khối */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
`;

export const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 350px;
  font-size: 1.4rem;
  color: #555;
`;

export const TotalPriceLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 350px;
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  gap: 10px;

  .total-price {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--primary-color);
  }
`;
