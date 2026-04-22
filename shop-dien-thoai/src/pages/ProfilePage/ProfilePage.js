import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";
import { getBase64 } from "../../untils";

import InputFormComponent from "../../components/InputForm/InpurtFormComponent";
import Loading from "../../components/LoaddingComponent/Loadding";
import * as message from "../../components/Message/Message";

import {
  WrapperConTainer,
  WrapperContentProfile,
  WrapperHeader,
  WrapperProfile,
  WrapperLabel,
  WrapperInput,
  WrapperButtonComponent,
  WrapperUploadFile,
} from "./style";

function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  // --- 1. STATE QUẢN LÝ LỖI (Dành cho Validate) ---
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
  });

  const mutation = useMutationHook((data) => {
    const { id, access_token, ...rest } = data;
    return UserService.updateUser(id, rest, access_token);
  });
  const { isPending, isSuccess, isError } = mutation;

  const handleGetDetailUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch],
  );

  useEffect(() => {
    if (user?.email) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success("Đã cập nhật thông tin");
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error("Cập nhật thất bại");
    }
  }, [isSuccess, isError, handleGetDetailUser, user?.id, user?.access_token]);

  // --- 2. HÀM VALIDATE LOGIC ---
  const validate = (nameField, value) => {
    let errorMessage = "";

    // Kiểm tra không được để trống chung cho các trường
    if (!value && nameField !== "avatar") {
      errorMessage = "Trường này không được để trống";
    } else {
      // Kiểm tra Email
      if (nameField === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage = "Định dạng email không hợp lệ";
        }
      }
      // Kiểm tra Số điện thoại (Phải là 10 số)
      if (nameField === "phone") {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          errorMessage = "Số điện thoại phải có đúng 10 chữ số";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [nameField]: errorMessage }));
    return errorMessage === "";
  };

  // --- 3. EVENT HANDLERS ---
  const handleUpdate = () => {
    // Validate tất cả trước khi submit
    const isNameValid = validate("name", name);
    const isEmailValid = validate("email", email);
    const isPhoneValid = validate("phone", phone);
    const isAddressValid = validate("address", address);

    if (isNameValid && isEmailValid && isPhoneValid && isAddressValid) {
      mutation.mutate({
        id: user?.id,
        email,
        name,
        phone,
        address,
        avatar,
        access_token: user?.access_token,
      });
    } else {
      message.error("Vui lòng kiểm tra lại các thông tin nhập liệu");
    }
  };

  const handleOnchangeName = (e) => {
    setName(e.target.value);
    validate("name", e.target.value);
  };
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
    validate("email", e.target.value);
  };
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
    validate("phone", e.target.value);
  };
  const handleOnchangeAddress = (e) => {
    setAddress(e.target.value);
    validate("address", e.target.value);
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setAvatar(file.preview);
    }
  };

  return (
    <WrapperProfile>
      <WrapperConTainer>
        <WrapperHeader style={{ textAlign: "center" }}>
          Thông tin người dùng
        </WrapperHeader>
        <Loading isLoading={isPending}>
          <WrapperContentProfile>
            {/* Trường Name */}
            <WrapperInput>
              <WrapperLabel htmlFor="name">Name</WrapperLabel>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <InputFormComponent
                  id="name"
                  value={name}
                  onChange={handleOnchangeName}
                  style={{ borderColor: errors.name ? "red" : "#d9d9d9" }}
                />
                {errors.name && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.name}
                  </span>
                )}
              </div>
              <WrapperButtonComponent onClick={handleUpdate}>
                Cập nhật
              </WrapperButtonComponent>
            </WrapperInput>

            {/* Trường Email */}
            <WrapperInput>
              <WrapperLabel htmlFor="email">Email</WrapperLabel>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <InputFormComponent
                  id="email"
                  value={email}
                  onChange={handleOnchangeEmail}
                  style={{ borderColor: errors.email ? "red" : "#d9d9d9" }}
                />
                {errors.email && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.email}
                  </span>
                )}
              </div>
              <WrapperButtonComponent onClick={handleUpdate}>
                Cập nhật
              </WrapperButtonComponent>
            </WrapperInput>

            {/* Trường Phone */}
            <WrapperInput>
              <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <InputFormComponent
                  id="phone"
                  value={phone}
                  onChange={handleOnchangePhone}
                  style={{ borderColor: errors.phone ? "red" : "#d9d9d9" }}
                />
                {errors.phone && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.phone}
                  </span>
                )}
              </div>
              <WrapperButtonComponent onClick={handleUpdate}>
                Cập nhật
              </WrapperButtonComponent>
            </WrapperInput>

            {/* Trường Address */}
            <WrapperInput>
              <WrapperLabel htmlFor="address">Address</WrapperLabel>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <InputFormComponent
                  id="address"
                  value={address}
                  onChange={handleOnchangeAddress}
                  style={{ borderColor: errors.address ? "red" : "#d9d9d9" }}
                />
                {errors.address && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.address}
                  </span>
                )}
              </div>
              <WrapperButtonComponent onClick={handleUpdate}>
                Cập nhật
              </WrapperButtonComponent>
            </WrapperInput>

            {/* Trường Avatar */}
            <WrapperInput>
              <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
              <div
                style={{
                  width: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WrapperUploadFile
                  onChange={handleOnchangeAvatar}
                  maxCount={1}
                  beforeUpload={() => false}
                  showUploadList={false}
                >
                  <Button style={{ width: "300px" }} icon={<UploadOutlined />}>
                    Select File
                  </Button>
                </WrapperUploadFile>
                {avatar && (
                  <img
                    src={avatar}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "40px",
                    }}
                    alt="avatar"
                  />
                )}
              </div>
              <WrapperButtonComponent onClick={handleUpdate}>
                Cập nhật
              </WrapperButtonComponent>
            </WrapperInput>
          </WrapperContentProfile>
        </Loading>
      </WrapperConTainer>
    </WrapperProfile>
  );
}

export default ProfilePage;
