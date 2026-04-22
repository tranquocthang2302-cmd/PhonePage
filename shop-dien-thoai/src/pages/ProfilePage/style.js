import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Upload } from "antd";

export const WrapperHeader = styled.h1`
  margin: 16px 0;
  font-size: 2.4rem;
`;
export const WrapperProfile = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const WrapperConTainer = styled.div`
  width: 1270px;
`;
export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  width: 700px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
`;
export const WrapperLabel = styled.label`
  color: var(--black-color);
  font-size: 1.6rem;
  width: 40px;
`;
export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  justify-content: center;
  & + & {
    margin-top: 20px;
  }
`;
export const WrapperButtonComponent = styled(ButtonComponent)`
  &:hover {
    background-color: var(--primary-color) !important;

    color: #fff !important;
    border: 1px solid var(--primary-color) !important;
  }
`;
export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px dashed #d9d9d9;
    background-color: #fafafa;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Để ảnh không tràn ra ngoài vòng tròn */
  }

  /* Ẩn cái danh sách file mặc định của AntD đi cho sạch */
  & .ant-upload-list-item-container {
    display: none;
  }
`;
