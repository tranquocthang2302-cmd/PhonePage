import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

import * as UserSerVice from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";

import InputFormComponent from "../../components/InputForm/InpurtFormComponent";
import Loading from "../../components/LoaddingComponent/Loadding";
import * as message from "../../components/Message/Message";

import imageLogo from "../../assets/images/logo-login.png";
import {
  WrapperButtonCustom,
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperEyes,
  WrapperLogin,
  WrapperModel,
  WrapperTextLight,
} from "./style";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  // --- STATE QUẢN LÝ LỖI VALIDATE ---
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutationHook((data) => UserSerVice.loginUser(data));
  const { data, isPending, isSuccess } = mutation;

  const handleGetDetailUser = useCallback(
    async (id, token) => {
      const res = await UserSerVice.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch],
  );

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Đăng nhập thành công");
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token);
        }
      }
      if (location?.state) {
        navigate(location.state);
      } else {
        navigate("/");
      }
    } else if (data?.status === "ERR") {
      // Chỉ báo lỗi ở ĐÂY thôi
      message.error(data?.message || "Tên đăng nhập hoặc mật khẩu không đúng");
    }
    // Không cần message.error ở đây vì đã có câu thông báo đỏ hiển thị dưới nút
  }, [isSuccess, data, navigate, handleGetDetailUser, location.state]);

  // --- HÀM VALIDATE ---
  const validate = (name, value) => {
    let errorMessage = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMessage = "Vui lòng nhập email";
      } else if (!emailRegex.test(value)) {
        errorMessage = "Email không đúng định dạng";
      }
    }
    if (name === "password") {
      if (!value) {
        errorMessage = "Vui lòng nhập mật khẩu";
      } else if (value.length < 6) {
        errorMessage = "Mật khẩu phải có ít nhất 6 ký tự";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return errorMessage === "";
  };

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
    validate("email", e.target.value);
    if (data) mutation.reset(); // Xóa trạng thái lỗi cũ của Backend
  };

  const handleOnchangePassword = (e) => {
    setPassWord(e.target.value);
    validate("password", e.target.value);
    if (data) mutation.reset(); // Xóa trạng thái lỗi cũ của Backend
  };

  const handleEyePassword = () => setIsShowPassword(!isShowPassword);

  const handleSignIn = () => {
    const isEmailValid = validate("email", email);
    const isPasswordValid = validate("password", password);
    if (isEmailValid && isPasswordValid) {
      mutation.mutate({ email, password });
    }
  };

  const handleNavigateRegister = () => navigate("/register");

  return (
    <WrapperModel>
      <WrapperLogin>
        <WrapperContainerLeft>
          <h1>Đăng nhập</h1>

          <div style={{ marginTop: "20px" }}>
            {/* Input Email */}
            <div style={{ marginBottom: "15px" }}>
              <InputFormComponent
                value={email}
                placeholder="abc@gmail.com"
                onChange={handleOnchangeEmail}
                style={{ borderColor: errors.email ? "red" : "#d9d9d9" }}
              />
              {errors.email && (
                <span
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.email}
                </span>
              )}
            </div>
            <div style={{ position: "relative", marginBottom: "15px" }}>
              <InputFormComponent
                placeholder="password"
                type={isShowPassword ? "text" : "password"}
                value={password}
                onChange={handleOnchangePassword}
                style={{ borderColor: errors.password ? "red" : "#d9d9d9" }}
              />
              <WrapperEyes onClick={handleEyePassword}>
                {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
              </WrapperEyes>
              {errors.password && (
                <span
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          <Loading isLoading={isPending}>
            <WrapperButtonCustom
              disabled={!email || !password || errors.email || errors.password}
              onClick={handleSignIn}
              styleButton={{
                width: "410px",
                margin: "30px 0 10px 0",
                height: "49px",
                background:
                  !email || !password || errors.email || errors.password
                    ? "#ccc"
                    : "var(--primary-color)",
                color: "#fff",
                fontSize: "2rem",
                fontWeight: 600,
                border: "none",
              }}
            >
              Đăng nhập
            </WrapperButtonCustom>
          </Loading>

          <div style={{ marginTop: "24px" }}>
            <p>
              <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
            </p>
            <p>
              Chưa có tài khoản?
              <WrapperTextLight
                style={{ marginLeft: "8px", cursor: "pointer" }}
                onClick={handleNavigateRegister}
              >
                Tạo tài khoản
              </WrapperTextLight>
            </p>
          </div>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="logo" />
          <div
            style={{
              textAlign: "center",
              color: "var(--primary-color)",
              marginTop: "15px",
            }}
          >
            <h4>Mua sắm tại didongViet</h4>
            <p>Siêu ưu đãi mỗi ngày</p>
          </div>
        </WrapperContainerRight>
      </WrapperLogin>
    </WrapperModel>
  );
}

export default SignInPage;
