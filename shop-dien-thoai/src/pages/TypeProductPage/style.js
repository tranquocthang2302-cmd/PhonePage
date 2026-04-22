import { Col } from "antd";
import styled from "styled-components";

export const WrapperProduct = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 15px; /* Khoảng cách giữa các card */
`;

// export const WrapperProduct = styled(Col)`
//   padding: 0 !important; // Xóa padding mặc định của Ant để dóng hàng chuẩn
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
// `;
// export const StyledRow = styled(Row)`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 15px; // Khoảng cách giữa các Card
//   margin-left: 0 !important;
//   margin-right: 0 !important;

//   /* Ép các Card con chiếm đúng 1/5 hàng */
//   & > div {
//     /* (100% - (4 gap * 15px)) / 5 */
//     flex: 0 0 calc((100% - 60px) / 5);
//     max-width: calc((100% - 60px) / 5);
//   }
// `;
export const WrapperNavbar = styled(Col)`
  background: var(--white-color);
  border-radius: 4px;
  height: fit-content;
  padding: 10px 0 0 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-right: 16px;
`;
