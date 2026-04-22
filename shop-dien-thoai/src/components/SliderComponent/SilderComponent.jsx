import { Image } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Hàm tùy chỉnh nút Next
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        right: "15px", // Nằm gọn bên trong ảnh
        zIndex: 1,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)", // Đổ bóng nhẹ
      }}
      onClick={onClick}
    >
      <RightOutlined style={{ color: "black", fontSize: "16px" }} />
    </div>
  );
};

// Hàm tùy chỉnh nút Prev
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        left: "15px", // Nằm gọn bên trong ảnh
        zIndex: 1,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      }}
      onClick={onClick}
    >
      <LeftOutlined style={{ color: "black", fontSize: "16px" }} />
    </div>
  );
};

function SilderComponent({ arrImages }) {
  const settings = {
    dots: true,
    infinite: true,

    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />, // Sử dụng nút tự chế
    prevArrow: <PrevArrow />,
  };

  return (
    <div style={{ padding: "8px 16px" }}>
      <Slider {...settings}>
        {arrImages.map((image, index) => {
          return (
            <div key={index} style={{ width: "100%", outline: "none" }}>
              <Image
                src={image}
                alt="slider"
                preview={false}
                width="100%"
                height="274px" // Thay 274px bằng chiều cao cố định bạn muốn cho Slider
                style={{
                  objectFit: "cover",
                  display: "block", // Đảm bảo không có khoảng trống thừa phía dưới
                  borderRadius: "4px",
                  boxShadow: "0 3px 12px rgba(0,0,0,.13)",
                }}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default SilderComponent;
