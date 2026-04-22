import styled from "styled-components";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
export const WrapperImageLargeProductDetail = styled.div`
  display: flex;
  justify-content: center;
`;

export const WrapperTextOldPriceProduct = styled.div`
  color: #888; /* Đổi thành màu xám cho đúng chất giá cũ */
  font-size: 1.6rem; /* Nhỏ hơn giá mới một chút */
  text-decoration: line-through; /* Quan trọng: Tạo dấu gạch ngang */
  font-weight: 500;
  line-height: 2.4rem;
  margin-top: 10px;
`;
export const WrapperStyleNameProduct = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 3.2rem;
  color: #22313f;
  margin: 0 0 4px;
`;
export const WrapperTextPriceProduct = styled.h1`
  color: var(--primary-color);
  font-szie: 24px;
  font-weight: 400;
  line-height: 30px;
  margin-top: 10px;
`;
export const WrapperTextAddressProduct = styled.div`
  margin-top: 20px;
  span.address {
    text-decoration: underline;
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsisl;
  }
  ,
  div.change-adress {
    color: var(--primary-color);
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: 600;
    cursor: pointer;
  }
`;
export const WrapperQualityProduct = styled.div`
  margin-top: 20px;
  display: flex;
  height: 32px;
  align-items: center;
`;
export const WrapperButtonMethodBuy = styled.div`
  display: flex;
  flex-direction: column; /* Xếp chồng lên nhau */
  gap: 12px; /* Khoảng cách giữa 2 nút */
  margin-top: 30px;
`;
export const WrapperButtonBuy = styled(ButtonComponent)`
  /* Dùng &.ant-btn để tăng độ ưu tiên CSS (Specificity) */
  &.ant-btn:hover,
  &.ant-btn:focus,
  &.ant-btn:active {
    /* Ép background và border giữ nguyên theo style bạn truyền vào */

    border: none !important;
    color: #fff !important;
  }

  /* Tắt hiệu ứng 'wave' (vòng tròn tỏa ra) khi nhấn vào nút */
  &::after {
    display: none !important;
  }
`;
// style.js
