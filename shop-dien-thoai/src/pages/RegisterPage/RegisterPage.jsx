import { Image } from "antd";
import InputFormComponent from "../../components/InputForm/InpurtFormComponent";
import {
  WrapperButtonCustom,
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperLogin,
  WrapperModel,
  WrapperTextLight,
} from "./style";
import { WrapperEyes } from "../SignInPage/style";
import imageLogo from "../../assets/images/logo-login.png";
import { useCallback, useEffect, useState } from "react";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserSerVice from "../../services/UserService";
import Loading from "../../components/LoaddingComponent/Loadding";
import * as message from "../../components/Message/Message";

function SignUpPage() {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowPasswordConform, setIsShowPasswordConForm] = useState(false);

  // State dữ liệu
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  // --- 1. STATE QUẢN LÝ LỖI (Yêu cầu của Thắng) ---
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const mutation = useMutationHook((data) => UserSerVice.registerUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  const handleNavigateLogin = useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Đăng ký thành công");
      handleNavigateLogin();
    } else if (data?.status === "ERR") {
      message.error(data?.message);
    }
  }, [isSuccess, data, handleNavigateLogin]);

  // --- 2. HÀM VALIDATE LOGIC ---
  const validate = (name, value) => {
    let errorMessage = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMessage = "Vui lòng nhập email";
      } else if (!emailRegex.test(value)) {
        errorMessage = "Trường này phải là email (ví dụ: abc@gmail.com)";
      }
    }

    if (name === "password") {
      if (!value) {
        errorMessage = "Vui lòng nhập mật khẩu";
      } else if (value.length < 6) {
        errorMessage = "Mật khẩu phải có từ 6 ký tự trở lên";
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        errorMessage = "Vui lòng xác nhận mật khẩu";
      } else if (value !== password) {
        errorMessage = "Mật khẩu xác nhận không khớp";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return errorMessage === "";
  };

  // --- 3. HANDLERS CẬP NHẬT ---
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
    validate("email", e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassWord(e.target.value);
    validate("password", e.target.value);
    // Kiểm tra lại confirm nếu đã nhập trước đó
    if (confirmPassword) {
      const errorMsg =
        e.target.value === confirmPassword
          ? ""
          : "Mật khẩu xác nhận không khớp";
      setErrors((prev) => ({ ...prev, confirmPassword: errorMsg }));
    }
  };

  const handleOnchangeConFirmPassword = (e) => {
    setconfirmPassword(e.target.value);
    validate("confirmPassword", e.target.value);
  };

  const handleRegister = () => {
    const isEmailValid = validate("email", email);
    const isPasswordValid = validate("password", password);
    const isConfirmValid = validate("confirmPassword", confirmPassword);

    if (isEmailValid && isPasswordValid && isConfirmValid) {
      mutation.mutate({ email, password, confirmPassword });
    }
  };

  const handleEyePassword = () => setIsShowPassword(!isShowPassword);
  const handleEyePasswordConFirm = () =>
    setIsShowPasswordConForm(!isShowPasswordConform);

  return (
    <WrapperModel>
      <WrapperLogin>
        <WrapperContainerLeft>
          <h1 style={{ marginBottom: "20px" }}>Đăng ký</h1>

          {/* Email Field */}
          <div style={{ marginBottom: "15px" }}>
            <InputFormComponent
              placeholder="abc@gmail.com"
              value={email}
              onChange={handleOnchangeEmail}
              style={{ borderColor: errors.email ? "red" : "#d9d9d9" }}
            />
            {errors.email && (
              <span
                style={{
                  color: "red",
                  fontSize: "12px",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <InputFormComponent
              type={isShowPassword ? "text" : "password"}
              placeholder="Mật khẩu"
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
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <InputFormComponent
              type={isShowPasswordConform ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={handleOnchangeConFirmPassword}
              style={{
                borderColor: errors.confirmPassword ? "red" : "#d9d9d9",
              }}
            />
            <WrapperEyes onClick={handleEyePasswordConFirm}>
              {isShowPasswordConform ? <EyeFilled /> : <EyeInvisibleFilled />}
            </WrapperEyes>
            {errors.confirmPassword && (
              <span
                style={{
                  color: "red",
                  fontSize: "12px",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* API Error Message */}
          {data?.status === "ERR" && (
            <span
              style={{ color: "red", display: "block", marginBottom: "10px" }}
            >
              {data.message}
            </span>
          )}

          <Loading isLoading={isPending}>
            <WrapperButtonCustom
              disabled={
                !email ||
                !password ||
                !confirmPassword ||
                !!errors.email ||
                !!errors.password ||
                !!errors.confirmPassword
              }
              onClick={handleRegister}
              styleButton={{
                width: "410px",
                margin: "10px 0 10px 0",
                height: "49px",
                background:
                  !email ||
                  !password ||
                  !confirmPassword ||
                  errors.email ||
                  errors.password ||
                  errors.confirmPassword
                    ? "#ccc"
                    : "var(--primary-color)",
                color: "var(--white-color)",
                fontSize: "2rem",
                border: "none",
                fontWeight: 600,
              }}
            >
              Đăng ký
            </WrapperButtonCustom>
          </Loading>

          <div style={{ marginTop: "24px" }}>
            <p>
              Bạn đã có tài khoản ?
              <WrapperTextLight
                style={{ marginLeft: "8px", cursor: "pointer" }}
                onClick={handleNavigateLogin}
              >
                Đăng nhập
              </WrapperTextLight>
            </p>
          </div>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image-logo"></Image>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--primary-color)",
              marginTop: "15px",
            }}
          >
            <h4>Mua sắm tại Win-T Shop</h4>
            <p>Siêu ưu đãi mỗi ngày</p>
          </div>
        </WrapperContainerRight>
      </WrapperLogin>
    </WrapperModel>
  );
}

export default SignUpPage;
