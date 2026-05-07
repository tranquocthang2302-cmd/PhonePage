import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Upload } from "antd";

export const WrapperProfile = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa; /* Màu nền nhẹ nhàng giúp nổi bật khối nội dung */
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

export const WrapperConTainer = styled.div`
  width: 100%;
  max-width: 850px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* Hiệu ứng đổ bóng hiện đại */
  padding: 40px;
`;

export const WrapperHeader = styled.h1`
  margin: 0 0 40px 0;
  font-size: 2.8rem;
  font-weight: 700;
  color: #222;
  text-align: center;
  letter-spacing: -0.5px;
`;

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const WrapperInput = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #f1f1f1;

  &:last-child {
    border-bottom: none;
  }
`;

export const WrapperLabel = styled.label`
  color: #555;
  font-size: 1.5rem;
  font-weight: 600;
  width: 140px;
  padding-top: 10px;
`;

export const WrapperButtonComponent = styled(ButtonComponent)`
  height: 40px;
  width: 100px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.3rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: var(--primary-color) !important;
    color: #fff !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const WrapperUploadFile = styled(Upload)`
  .ant-btn {
    border-radius: 8px;
    height: 40px;
    border: 1px dashed #d9d9d9;

    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }
`;

export const AvatarPreview = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  margin-left: 20px;
  background-color: #eee;
`;
