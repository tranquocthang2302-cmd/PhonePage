import React, { useState } from "react";
import {
  MessageFilled,
  PhoneFilled,
  FacebookFilled,
  CloseOutlined,
} from "@ant-design/icons";

const ContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Thay thông tin của Thắng vào đây
  const myInfo = {
    zalo: "0837914752", // Số điện thoại Zalo
    phone: "0837914752", // Số gọi trực tiếp
    messenger: "quocthang120404", // Username Messenger cá nhân
  };

  const contactItems = [
    {
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
          alt="Zalo"
          style={{ width: 24 }}
        />
      ),
      color: "#0068ff",
      label: "Chat Zalo",
      action: () => window.open(`https://zalo.me/${myInfo.zalo}`, "_blank"),
    },
    {
      icon: <FacebookFilled style={{ fontSize: 24 }} />,
      color: "#1877f2",
      label: "Messenger",
      action: () => window.open(`https://m.me/quocthang120404`, "_blank"),
    },
    {
      icon: <PhoneFilled style={{ fontSize: 24 }} />,
      color: "#4caf50",
      label: "Gọi điện",
      action: () => window.open(`tel:${myInfo.phone}`, "_self"),
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        right: 30,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 12,
      }}
    >
      {/* List các nút ẩn/hiện */}
      {isOpen &&
        contactItems.map((item, index) => (
          <div
            key={index}
            onClick={item.action}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              animation: `fadeUp 0.3s ease forwards ${index * 0.1}s`,
              opacity: 0,
              transform: "translateY(20px)",
            }}
          >
            <span
              style={{
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: "1.2rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              {item.label}
            </span>
            <div
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: item.color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              {item.icon}
            </div>
          </div>
        ))}

      {/* Nút bấm chính (Bong bóng chat) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: isOpen ? "#666" : "#fe3834", // Màu đỏ cho hợp với Win-T Shop
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: 28,
          boxShadow: "0 5px 20px rgba(254, 56, 52, 0.4)",
          transition: "all 0.3s ease",
        }}
      >
        {isOpen ? <CloseOutlined /> : <MessageFilled />}
      </div>

      <style>{`
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ContactWidget;
