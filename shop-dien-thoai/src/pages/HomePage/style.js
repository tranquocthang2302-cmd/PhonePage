import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 44px;
  width: 1270px;
`;
export const WrapperButtonMore = styled(ButtonComponent)`
  /* Khi nút bình thường và có hover */
  &:hover:not(:disabled) {
    background-color: var(--primary-color) !important;
    span {
      color: #fff !important;
    }
  }

  /* Khi nút bị DISABLED */
  &:disabled {
    opacity: 0.5; /* Làm mờ nút đi 50% */
    cursor: not-allowed;
    background-color: #ccc !important; /* Màu nền xám nhạt khi tắt */
    border: none !important; /* Mất border */

    span {
      color: #333 !important; /* Màu chữ chuyển về #333 */
    }
  }
`;
// export const WrapperProduct = styled.div`
//   display: flex;
//   justify-content: flex-start;
//   flex-wrap: wrap;
//   gap: 15px;
//   margin-top: 20px;
//   padding-bottom: 20px;
//   padding-top: 20px;
//   background-color: var(--white-color);
//   padding-left: 70px;
//   border-radius: 8px;
// `;
export const WrapperProduct = styled.div`
  display: flex;
  justify-content: flex-start; /* Luôn xếp từ trái sang */
  flex-wrap: wrap;
  gap: 14px; /* Khoảng cách giữa các card */
  margin-top: 20px;
  width: 100%; /* Đảm bảo chiếm hết khung 1270px của cha */
  padding: 0 10px;
  & > div {
    /* Công thức chuẩn cho 5 cột:
       Lấy 100% chiều rộng trừ đi tổng các khoảng trống (4 cái gap x 14px = 56px)
       Sau đó chia đều cho 5 cột.
    */
    width: calc((100% - 56px) / 5);
    flex-shrink: 0; /* Ngăn không cho card bị co lại */
    flex-grow: 0; /* Ngăn không cho card tự nở ra chiếm chỗ trống */
  }
`;
