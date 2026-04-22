import styled from "styled-components";
export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  min-width: 60px;
  cursor: pointer;
  padding: 0 4px;

  &:hover {
    background: #d93333;
    color: var(--white-color);
  }
`;
