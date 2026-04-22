import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperLogin = styled.div`
  width: 800px;
  display: flex;
  height: 445px;
  border-radius: 6px;
  background-color: var(--white-color);
  color: var(--text-color);
`;
export const WrapperModel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: rgba(0, 0, 0, 0.53);
`;

export const WrapperContainerLeft = styled.div`
  padding: 40px 45px 24px;
`;

export const WrapperContainerRight = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  background: rgb(222, 235, 255);
`;
export const WrapperButtonCustom = styled(ButtonComponent)``;

export const WrapperTextLight = styled.span`
  color: var(--primary-color);
  text-decoration: none;
`;

export const WrapperEyes = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateX(-50%);
`;
