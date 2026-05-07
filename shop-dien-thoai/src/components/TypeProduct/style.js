import styled from "styled-components";

export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px; /* Giảm nhẹ chiều cao cho thanh thoát */
  min-width: 80px;
  cursor: pointer;
  padding: 0 16px; /* Tăng padding để chữ có không gian thở */
  font-size: 14px;
  font-weight: 500;
  color: #333;
  border-radius: 6px; /* Thêm bo góc nhẹ */
  transition: all 0.3s ease; /* Tạo hiệu ứng mượt mà khi hover */
  white-space: nowrap; /* Tránh bị xuống dòng nếu tên dài */
  margin: 0 4px; /* Khoảng cách giữa các item */

  &:hover {
    background: #e12424; /* Màu đỏ thương hiệu */
    color: #fff; /* Chữ trắng */
    transform: translateY(-2px); /* Hiệu ứng nhấc nhẹ lên khi di chuột */
    box-shadow: 0 4px 10px rgba(225, 36, 36, 0.2); /* Đổ bóng nhẹ cùng màu */
  }

  &:active {
    transform: translateY(0); /* Nhấn xuống khi click */
  }
`;
