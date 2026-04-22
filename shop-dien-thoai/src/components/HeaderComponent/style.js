import { Row } from "antd";
import styled from "styled-components";
export const WrapperHeader = styled(Row)`
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: no-wrap;
  width: 1270px;
  padding: 10px 0;
`;
export const WrapperTextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
`;
export const WrapperHeaderAccout = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #fff;
  gap: 10px;
`;
export const WrapperTextHeaderSmall = styled.span`
  font-size: 1.4rem;
`;
export const WrapperIconCart = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
export const BadgeCard = styled.span`
  position: absolute;
  top: -8px;
  right: 3px;
  background-color: rgb(254 240 138 / var(--tw-bg-opacity, 1));
  color: var(--primary-color);
  font-size: 10px;
  font-weight: bold;
  padding: 1px 5px;
  border-radius: 10px;
  border: 2px solid var(--primary-color);
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  &:hover {
    color: var(--primary-color);
  }
`;
