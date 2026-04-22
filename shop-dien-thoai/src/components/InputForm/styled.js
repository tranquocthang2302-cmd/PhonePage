import styled from "styled-components";
export const WrapperInputStyle = styled.input`
  width: 400px;
  height: 48px;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 1px solid #e0e0e0;
  color: var(--text-color);
  padding: 8px 0px;
  &:focus {
    outline: none;
  }
`;
