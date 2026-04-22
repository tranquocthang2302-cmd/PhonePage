import styled from "styled-components";
import { Upload } from "antd";
export const WrapperHeader = styled.h1`
  color: var(--black-color);
  font-size: 1.8rem;
`;

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload-select {
    display: flex;
  }
  .product-img {
  }
`;
