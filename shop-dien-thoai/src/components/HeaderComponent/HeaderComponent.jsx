import logo from "../../assets/images/logo.svg";
import { Col, Popover } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccout,
  WrapperTextHeaderSmall,
  BadgeCard,
  WrapperIconCart,
  WrapperContentPopup,
} from "./style";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Fragment } from "react/jsx-runtime";
import * as UserService from "../../services/UserService";
import { refreshUser } from "../../redux/slides/userSlide";
import { useState } from "react";
import Loading from "../LoaddingComponent/Loadding";
import { searchProduct } from "../../redux/slides/productSlide";

function HeaderComponent({ isHiddenSearch = false, isHiddenCart = false }) {
  const dispatch = useDispatch();
  const [loadding, setLoadding] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const navigate = useNavigate();

  const userOrderItems = order?.orderItems?.filter(
    (item) => item.user === user?.id,
  );

  const handleNavigateLogin = () => navigate("/sign-in");
  const handleNavigateRegister = () => navigate("/register");

  const handleLogout = async () => {
    setLoadding(true);
    try {
      await UserService.logoutUser();
      localStorage.removeItem("access_token");
      dispatch(refreshUser());
      navigate("/");
    } catch (e) {
      console.log(e);
    } finally {
      setLoadding(false);
    }
  };

  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "my-order") {
      navigate("/my-order", {
        state: { id: user?.id, access_token: user?.access_token },
      });
    } else {
      handleLogout();
    }
    setIsOpenPopup(false);
  };

  // PHẦN CHỈNH SỬA: Menu nội dung của Popover
  const content = (
    <Fragment>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>
        Thông tin người dùng
      </WrapperContentPopup>

      {/* Nếu là Admin thì hiện Quản lý hệ thống */}
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          Quản lí hệ thống
        </WrapperContentPopup>
      )}

      {/* CHỈ HIỆN "Đơn hàng của tôi" nếu KHÔNG PHẢI Admin */}
      {!user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("my-order")}>
          Đơn hàng của tôi
        </WrapperContentPopup>
      )}

      <WrapperContentPopup onClick={() => handleClickNavigate()}>
        Đăng xuất
      </WrapperContentPopup>
    </Fragment>
  );

  const onSearch = (e) => setSearch(e.target.value);
  const handleSearch = () => dispatch(searchProduct(search));

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "var(--primary-color)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <WrapperHeader>
        <Col span={4}>
          <WrapperTextHeader onClick={() => navigate("/")}>
            <img
              src={logo}
              alt="logo"
              style={{ width: "150px", height: "auto", cursor: "pointer" }}
            />
          </WrapperTextHeader>
        </Col>

        {!isHiddenSearch && (
          <Col span={14}>
            <ButtonInputSearch
              onChange={onSearch}
              size="large"
              placeholder="Tìm sản phẩm"
              onClick={handleSearch}
            >
              Tìm kiếm
            </ButtonInputSearch>
          </Col>
        )}

        <Col span={6}>
          <Loading isLoading={loadding}>
            <WrapperHeaderAccout>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "183px",
                  justifyContent: "center",
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    style={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <UserOutlined style={{ fontSize: "30px", color: "#fff" }} />
                )}

                <div style={{ marginLeft: "8px" }}>
                  {user?.name || user?.email ? (
                    <Popover
                      content={content}
                      trigger="click"
                      open={isOpenPopup}
                      onOpenChange={(open) => setIsOpenPopup(open)}
                    >
                      <div
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          color: "#fff",
                          maxWidth: "150px",
                          overflow: "hidden", // Cắt bỏ phần chữ bị tràn
                          textOverflow: "ellipsis", // Biến phần bị cắt thành dấu "..."
                          whiteSpace: "nowrap", // Không cho chữ nhảy xuống dòng
                          display: "inline-block", // Để thuộc tính width có tác dụng
                          verticalAlign: "middle", // Giúp tên canh đều với icon User
                        }}
                      >
                        {user.name ? user.name : user.email}
                      </div>
                    </Popover>
                  ) : user?.access_token ? (
                    <div style={{ color: "#fff", fontSize: "12px" }}>
                      Đang tải...
                    </div>
                  ) : (
                    <WrapperTextHeaderSmall>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={handleNavigateLogin}
                      >
                        Đăng nhập
                      </span>
                      <span style={{ margin: "2px" }}>/</span>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={handleNavigateRegister}
                      >
                        Đăng ký
                      </span>
                    </WrapperTextHeaderSmall>
                  )}
                </div>
              </div>

              {/* GIỎ HÀNG: Chỉ hiện cho khách hàng (không phải Admin) */}
              {!isHiddenCart && !user?.isAdmin && (
                <div
                  onClick={() => navigate("/order")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <WrapperIconCart>
                    <ShoppingCartOutlined
                      style={{
                        fontSize: "30px",
                        color: "#fff",
                        marginRight: "8px",
                      }}
                    />
                    <BadgeCard>{userOrderItems?.length || 0}</BadgeCard>
                  </WrapperIconCart>
                  <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                </div>
              )}
            </WrapperHeaderAccout>
          </Loading>
        </Col>
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent;
