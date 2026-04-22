import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Khai báo biến */
    --width-image-card: 240px;
    --color-container: #e7e3e3;
    --white-color: #fff;
    --black-color: #000;
    --primary-color: #be1e2d; /* Màu đỏ thương hiệu của Thắng */
    --excel-color: #1d7444;   /* Thêm biến màu Excel này vào */
    --text-color: #333;
    --star-color: #fadb14;
    --font-main: 'Inter', sans-serif;
    --border-color: #d9d9d9;
  }

  /* Style cho nút Export Excel của Thắng */
  .btn-export-excel {
    background-color: var(--excel-color) !important;
    color: var(--white-color) !important;
    border: 1px solid var(--excel-color) !important;
    padding: 6px 16px !important;
    font-size: 14px !important;
    font-family: var(--font-main) !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-weight: 500 !important;
    display: inline-block !important;
  }

  .btn-export-excel:hover {
    background-color: #155d36 !important; /* Màu xanh đậm hơn khi hover */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    transform: translateY(-1px);
  }

  .btn-export-excel:active {
    transform: translateY(0);
  }
`;
