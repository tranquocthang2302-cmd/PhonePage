import styled from "styled-components";
import { Card } from "antd";
export const WrapperCardStyle = styled(Card)`
  width: var(--width-image-card);
  border: 1px solid var(--border-color);
  position: relative;
  & img {
    width: 100%; /* Ép ảnh rộng bằng đúng cái Card */
    height: auto; /* Giữ đúng tỉ lệ ảnh, không bị méo */
    display: block; /* Xóa khoảng hở nhỏ dưới chân ảnh */
    border: 1px solid var(--border-color);
    border-bottom: none;
  }
`;
export const WrapperInstallment = styled.div`
  content: "";
  display: flex;
  align-items: center;
  position: absolute;
  justify-content: center;
  height: 23px;
  font-size: 11px;
  width: 76px;
  line-height: 13px;
  font-weight: 500;
  border-radius: 4px;
  padding: 0 4px;
  background-color: var(--white-color); /* Sửa thành background-color */
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  top: 4px;
  left: 4px;
  z-index: 2; /* Đảm bảo nó nổi lên trên ảnh */
`;
export const StyleNameProduct = styled.h2`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: rgb(39, 39, 42);
  margin: 8px 0;

  /* Logic 2 dòng có dấu ... */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;

  /* Giữ chiều cao cố định để các Card luôn cao bằng nhau */
  height: 40px;
`;
export const WrapperReportText = styled.div`
  font-size: 1.4rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  margin-top: 24px;
  /* Quan trọng: Đây là mốc tọa độ cho các con dùng absolute */
`;

export const WrapperStyleTextSell = styled.span`
  /* Đẩy chữ sang phải để nhường chỗ cho gạch và khoảng trống */
  padding-left: 16px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    /* Căn lề trái 8px (nằm giữa khoảng padding-left 16px) */
    left: 8px;

    /* Căn giữa theo chiều dọc */
    top: 50%;
    transform: translateY(-50%);

    width: 1px;
    height: 16px;
    background-color: rgb(133, 133, 139);
  }
`;
export const WrapperPriceText = styled.div`
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: 400;

  align-items: center;
  margin-top: 8px;
`;
export const WrapperDiscountText = styled.span`
  color: var(--primary-color);
  font-size: 1.4rem;
  font-weight: 400;
  margin-left: 8px;
`;
