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
  AvatarPreview,
} from "./style";

function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

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
      message.success("Cập nhật thông tin thành công!");
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error("Có lỗi xảy ra khi cập nhật!");
    }
  }, [isSuccess, isError, handleGetDetailUser, user?.id, user?.access_token]);

  const validate = (nameField, value) => {
    let errorMessage = "";
    if (!value && nameField !== "avatar") {
      errorMessage = "Thông tin này là bắt buộc";
    } else {
      if (nameField === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          errorMessage = "Email không đúng định dạng";
      }
      if (nameField === "phone") {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value))
          errorMessage = "Số điện thoại phải có 10 số";
      }
    }
    setErrors((prev) => ({ ...prev, [nameField]: errorMessage }));
    return errorMessage === "";
  };

  const handleUpdate = (field) => {
    const fieldValues = { name, email, phone, address };
    const isValid = validate(field, fieldValues[field]);

    if (isValid) {
      mutation.mutate({
        id: user?.id,
        [field]: fieldValues[field],
        access_token: user?.access_token,
      });
    }
  };

  const handleUpdateAvatar = () => {
    mutation.mutate({
      id: user?.id,
      avatar,
      access_token: user?.access_token,
    });
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
        <WrapperHeader>Hồ Sơ Cá Nhân</WrapperHeader>
        <Loading isLoading={isPending}>
          <WrapperContentProfile>
            {/* Ảnh đại diện */}
            <WrapperInput style={{ alignItems: "center" }}>
              <WrapperLabel>Ảnh đại diện</WrapperLabel>
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <WrapperUploadFile
                  onChange={handleOnchangeAvatar}
                  maxCount={1}
                  beforeUpload={() => false}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
                </WrapperUploadFile>
                {avatar && <AvatarPreview src={avatar} alt="avatar" />}
              </div>
              <WrapperButtonComponent onClick={handleUpdateAvatar}>
                Cập nhật
              </WrapperButtonComponent>
            </WrapperInput>

            {/* Các trường thông tin */}
            {[
              {
                id: "name",
                label: "Họ và tên",
                value: name,
                onChange: (e) => {
                  setName(e.target.value);
                  validate("name", e.target.value);
                },
              },
              {
                id: "email",
                label: "Địa chỉ Email",
                value: email,
                onChange: (e) => {
                  setEmail(e.target.value);
                  validate("email", e.target.value);
                },
              },
              {
                id: "phone",
                label: "Số điện thoại",
                value: phone,
                onChange: (e) => {
                  setPhone(e.target.value);
                  validate("phone", e.target.value);
                },
              },
              {
                id: "address",
                label: "Địa chỉ nhận hàng",
                value: address,
                onChange: (e) => {
                  setAddress(e.target.value);
                  validate("address", e.target.value);
                },
              },
            ].map((item) => (
              <WrapperInput key={item.id}>
                <WrapperLabel htmlFor={item.id}>{item.label}</WrapperLabel>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <InputFormComponent
                    id={item.id}
                    value={item.value}
                    onChange={item.onChange}
                    style={{
                      borderRadius: "8px",
                      height: "40px",
                      padding: "10PX",
                      borderColor: errors[item.id] ? "#ff4d4f" : "#d9d9d9",
                    }}
                  />
                  {errors[item.id] && (
                    <span
                      style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {errors[item.id]}
                    </span>
                  )}
                </div>
                <WrapperButtonComponent onClick={() => handleUpdate(item.id)}>
                  Cập nhật
                </WrapperButtonComponent>
              </WrapperInput>
            ))}
          </WrapperContentProfile>
        </Loading>
      </WrapperConTainer>
    </WrapperProfile>
  );
}

export default ProfilePage;
