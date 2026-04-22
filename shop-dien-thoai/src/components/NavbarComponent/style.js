import styled from "styled-components";

export const WrapperNav = styled.div`
  width: 180px;
  font-size: 1.6rem;
`;

export const WrapperLabel = styled.h4`
  color: var(--black-color);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 16px;
`;
export const WrapperTextValue = styled.li`
  color: var(--text-color);

  font-weight: 400;
  list-style: none;
`;
export const WrapperLinkValue = styled.a`
  text-decoration: none;
  color: var(--text-color);
`;

export const WrapperListContent = styled.ul`
  padding: 0;
`;
export const WrapperItemPrice = styled.a`
  display: inline-block;
  width: fit-content; /* Hoặc dùng cái này để đảm bảo hơn */
  text-decoration: none;
  color: var(--text-color);
  background-color: #f5f5f5;
  padding: 4px 12px;
  margin-bottom: 4px;
  margin-botton: 2px;
  border-radius: 10px;
  min-width: 50px;
  font-size: 1.4rem;
`;
