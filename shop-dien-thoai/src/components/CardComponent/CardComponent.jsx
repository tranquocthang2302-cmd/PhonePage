import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperInstallment,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
} from "./Style";
import { convertPrice } from "../../untils";

function CardComponent(props) {
  const { countInStock, image, name, price, rating, selled, newPrice, id } =
    props;

  const navigate = useNavigate();

  // Kiểm tra trạng thái hết hàng
  const isOutOfStock = countInStock === 0;

  const handileDetailProduct = (id) => {
    // Nếu hết hàng thì chặn không cho chuyển trang
    if (isOutOfStock) return;
    navigate(`/product-detail/${id}`);
  };

  return (
    <WrapperCardStyle
      style={{
        overflow: "hidden",
        // UX: Làm mờ Card và đổi chuột khi hết hàng
        opacity: isOutOfStock ? 0.6 : 1,
        cursor: isOutOfStock ? "not-allowed" : "pointer",
        position: "relative",
      }}
      onClick={() => handileDetailProduct(id)}
      // Chỉ cho phép hiệu ứng hover khi còn hàng
      hoverable={!isOutOfStock}
      cover={
        <div style={{ position: "relative" }}>
          <img
            draggable={false}
            alt="product"
            src={image}
            style={{
              width: "100%",
              height: "240px",
              // UX: Làm ảnh hơi xám lại khi hết hàng
              filter: isOutOfStock ? "grayscale(100%)" : "none",
            }}
          />

          {isOutOfStock && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                color: "#fff",
                padding: "10px 20px",
                fontWeight: "bold",
                borderRadius: "4px",
                fontSize: "16px",
                zIndex: 1,
                whiteSpace: "nowrap",
              }}
            >
              HẾT HÀNG
            </div>
          )}
        </div>
      }
    >
      <WrapperInstallment>Trả góp 0%</WrapperInstallment>
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span>
          <span>{rating}</span>
          <StarFilled
            style={{ fontSize: "12px", color: "var(--star-color)" }}
          />
        </span>
        <WrapperStyleTextSell>Đã bán {selled || 0}+</WrapperStyleTextSell>
      </WrapperReportText>

      <WrapperPriceText>
        {newPrice && newPrice !== price ? (
          <>
            <div
              style={{
                fontSize: "14px",
                color: "#888",
                textDecoration: "line-through",
              }}
            >
              {convertPrice(price)}
            </div>
            <div
              style={{
                color: "var(--primary-color)",
                fontWeight: "400",
                fontSize: "18px",
                marginTop: "4px",
              }}
            >
              {convertPrice(newPrice)}
            </div>
          </>
        ) : (
          <div
            style={{
              color: "var(--primary-color)",
              fontWeight: "400",
              fontSize: "18px",
            }}
          >
            {convertPrice(price)}
          </div>
        )}
      </WrapperPriceText>
    </WrapperCardStyle>
  );
}

export default CardComponent;
