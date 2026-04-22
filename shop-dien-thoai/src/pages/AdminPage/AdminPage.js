import { Menu } from "antd";
import { useState } from "react";
import { getItem } from "../../untils"; // Đảm bảo đường dẫn này đúng nhé Thắng
import {
  UserOutlined,
  ProductFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import OrderAdmin from "../../components/OrderAdmin/OrderAdmin";

function AdminPage() {
  const [keySelected, setKeySelected] = useState("");
  const handleOnclick = ({ key }) => {
    setKeySelected(key);
  };
  const items = [
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <ProductFilled />),
    getItem("Đơn hàng", "order", <ShoppingCartOutlined />),
  ];

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser></AdminUser>;

      case "product":
        return <AdminProduct></AdminProduct>;
      case "order":
        return <OrderAdmin></OrderAdmin>;
      default:
        return <></>;
    }
  };

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        <div style={{ display: "flex" }}>
          <Menu
            mode="inline"
            // openKeys={openKeys}
            // onOpenChange={onOpenChange}
            style={{
              width: "256px",
              height: "100vh",
              boxShadow: "0 3px 12px rgba(0, 0, 0, .13)",
              borderRadius: "8px",
            }}
            items={items}
            onClick={handleOnclick}
            selectedKeys={[keySelected]}
          />
          <div style={{ flex: 1, marginLeft: "8px" }}>
            {renderPage(keySelected)}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
