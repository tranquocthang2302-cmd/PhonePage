import React from "react";
import {
  WrapperLabel,
  WrapperListContent,
  WrapperNav,
  WrapperTextValue,
} from "./style";
import { useNavigate, useLocation } from "react-router-dom";

function NavbarComponent({ types = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateType = (type) => {
    const path = type
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_");

    navigate(`/product/${path}`, { state: type });
  };

  return (
    <WrapperNav>
      <WrapperLabel>DANH MỤC</WrapperLabel>
      <WrapperListContent>
        {types &&
          types.map((item) => {
            // Kiểm tra xem item này có phải là danh mục đang được chọn không
            const isActive = location.state === item;

            return (
              <WrapperTextValue
                key={item}
                onClick={() => handleNavigateType(item)}
                style={{
                  cursor: "pointer",
                  padding: "12px 15px",
                  borderRadius: "6px",
                  marginBottom: "4px",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  // Logic đổi màu khi active hoặc hover
                  backgroundColor: isActive
                    ? "var(--primary-color)"
                    : "transparent",
                  color: isActive ? "#fff" : "#333",
                  fontWeight: isActive ? "600" : "400",
                  boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                }}
                // Hiệu ứng hover cho các item không active
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "#f5f5f5";
                    e.target.style.color = "var(--primary-color)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#333";
                  }
                }}
              >
                {item}
              </WrapperTextValue>
            );
          })}
      </WrapperListContent>
    </WrapperNav>
  );
}

export default NavbarComponent;
