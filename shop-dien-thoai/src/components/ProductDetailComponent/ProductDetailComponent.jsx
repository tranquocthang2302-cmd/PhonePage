import { Col, Row, Image, Input, Rate } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import {
  WrapperButtonBuy,
  WrapperButtonMethodBuy,
  WrapperImageLargeProductDetail,
  WrapperQualityProduct,
  WrapperStyleNameProduct,
  WrapperTextOldPriceProduct,
  WrapperTextPriceProduct,
} from "./style";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../../components/LoaddingComponent/Loadding";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import bannerforbuy from "../../assets/images/bannerforbuy.webp";
import * as ProductService from "../../services/ProductService";
import * as message from "../../components/Message/Message";
import { convertPrice } from "../../untils"; // Điều chỉnh đường dẫn cho đúng với cấu trúc thư mục của Thắng
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { WrapperStyleTextSell } from "../../components/CardComponent/Style";
import { useNavigate } from "react-router-dom";

function ProductDetailComponent({ idProduct }) {
  const [numProduct, setNumProduct] = useState(1);

  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, data: productDetail } = useQuery({
    queryKey: ["productDetail", idProduct],
    queryFn: () => ProductService.getDetailProduct(idProduct),
    enabled: !!idProduct,
  });
  const product = productDetail?.data;
  const onChange = (e) => {
    const value = Number(e.target.value);

    // Nếu gõ số lớn hơn kho -> trả về số tối đa của kho
    if (value > product?.countInStock) {
      setNumProduct(product?.countInStock);
      message.warning(
        `Trong kho chỉ còn lại ${product?.countInStock} sản phẩm`,
      );
    }
    // Nếu gõ số nhỏ hơn 1 hoặc xóa trắng -> mặc định là 1
    else if (value < 1) {
      setNumProduct(1);
    } else {
      setNumProduct(value);
    }
  };
  const handleChangeCount = (type) => {
    if (type === "increase") {
      if (numProduct < product?.countInStock) {
        setNumProduct((prev) => prev + 1);
      } else {
        message.warning("Đã đạt số lượng tối đa trong kho!");
      }
    } else if (type === "decrease") {
      setNumProduct((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };
  //xử lý thêm giỏ hàng
  // ProductDetailComponent.js
  const handleAddOrderProduct = () => {
    if (!user?.id) {
      message.error("Vui lòng đăng nhập để thực hiện mua hàng");
      navigate("/sign-in", { state: `/product-detail/${idProduct}` });
      return;
    }
    if (user?.isAdmin) {
      message.error("Tài khoản Admin không có chức năng mua hàng!");
      return;
    }
    const itemInCart = order?.orderItems?.find(
      (item) => item.product === product?._id && item.user === user?.id,
    );

    const currentAmountInCart = itemInCart?.amount;
    const totalAfterAdd = currentAmountInCart + numProduct;

    // 1. Nếu trong giỏ đã có đủ số lượng tối đa rồi
    if (currentAmountInCart >= product?.countInStock) {
      message.error(
        `Sản phẩm này đã có đủ ${product?.countInStock} (tối đa) trong giỏ hàng!`,
      );
      return;
    }

    // 2. Nếu định thêm mà tổng vượt quá kho
    if (totalAfterAdd > product?.countInStock) {
      message.error(
        `Không thể thêm ${numProduct} sản phẩm. Kho chỉ còn lại ${product?.countInStock - currentAmountInCart} cái có thể mua thêm.`,
      );
      return;
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: product?.name,
            amount: numProduct,
            image: product?.image,
            price: product?.newPrice || product?.price,
            product: product?._id,
            discount: product?.discount,
            countInStock: product?.countInStock,
            user: user?.id,
          },
        }),
      );
      message.success("Thêm vào giỏ hàng thành công!");
    }
  };

  return (
    <Loading isLoading={isLoading}>
      {product && (
        <Row
          style={{
            width: "1270px",
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "center",
            padding: "20px 40px",
            backgroundColor: "var(--white-color)",
            borderRadius: "8px",
          }}
        >
          <Col
            span={14}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
              borderRadius: "4px",
              marginRight: "20px",
              padding: "10px 0",
              border: "1px solid var(--border-color)",
              boxShadow: "rgba(0, 0, 0, 0.13) 0px 3px 12px",
            }}
          >
            <WrapperImageLargeProductDetail>
              <Image width={500} preview={false} src={product.image}></Image>
            </WrapperImageLargeProductDetail>
          </Col>
          <Col
            style={{
              backgroundColor: "var(--white-color)",
              borderRadius: "4px",
              flex: "none",
              border: "1px solid var(--border-color)",
              padding: "20px",
              boxShadow: "rgba(0, 0, 0, 0.13) 0px 3px 12px",
            }}
            span={10}
          >
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <WrapperStyleNameProduct>
                  {product.name}
                </WrapperStyleNameProduct>
                <div></div>
              </div>

              <Rate allowHalf defaultValue={product?.rating}></Rate>
              <WrapperStyleTextSell style={{ fontSize: "15px" }}>
                Đã bán {product.selled}+
              </WrapperStyleTextSell>
              {product?.newPrice && product?.newPrice !== product?.price ? (
                <>
                  {/* Hiện giá gốc (gạch ngang) */}
                  <WrapperTextOldPriceProduct>
                    {convertPrice(product?.price)}
                  </WrapperTextOldPriceProduct>

                  {/* Hiện giá mới (giá đã giảm từ database) */}
                  <WrapperTextPriceProduct>
                    {convertPrice(product?.newPrice)}
                  </WrapperTextPriceProduct>
                </>
              ) : (
                /* Nếu không có giá mới: Chỉ hiện giá gốc duy nhất */
                <WrapperTextPriceProduct>
                  {convertPrice(product?.price)}
                </WrapperTextPriceProduct>
              )}

              <WrapperQualityProduct>
                <div style={{ display: "flex", fontSize: "1.6rem" }}>
                  <div style={{ marginRight: "8px" }}>Số lượng </div>
                  <div style={{ marginRight: "8px" }}>: </div>
                </div>

                <div style={{ display: "flex" }}>
                  <ButtonComponent
                    size="small"
                    styleButton={{
                      height: "32px",
                      borderRadius: "0",
                      padding: "0 20px",
                    }}
                    icon={<MinusOutlined />}
                    onClick={() => handleChangeCount("decrease")}
                  ></ButtonComponent>

                  <Input
                    style={{
                      width: "20%",
                      borderRadius: "0",
                      borderLeft: "none",
                      borderRight: "none",
                      textAlign: "center",
                    }}
                    onChange={onChange}
                    value={numProduct}
                  ></Input>
                  <ButtonComponent
                    size="small"
                    styleButton={{
                      borderRadius: "0",
                      height: "32px",
                      padding: "0 20px",
                    }}
                    icon={<PlusOutlined />}
                    onClick={() => handleChangeCount("increase")}
                  ></ButtonComponent>
                </div>
              </WrapperQualityProduct>
              <WrapperButtonMethodBuy>
                <WrapperButtonBuy
                  styleButton={{
                    width: "100%",
                    background: "var(--primary-color)",
                    height: "56px",
                  }}
                  onClick={handleAddOrderProduct}
                >
                  <div style={{ color: "var(--white-color)" }}>
                    <div>MUA NGAY</div>
                    <div>Giao tận nơi hoặc nhận tại cửa hàng</div>
                  </div>
                </WrapperButtonBuy>

                <WrapperButtonBuy
                  styleButton={{
                    width: "100%",
                    background: "#2f6bff",
                    height: "56px",
                  }}
                >
                  <div style={{ color: "var(--white-color)" }}>
                    <div>TRẢ GÓP 0% QUA THẺ</div>
                    <div>Visa, MasterCard, JCB, Amax</div>
                  </div>
                </WrapperButtonBuy>
              </WrapperButtonMethodBuy>
              <div style={{ marginTop: "20px" }}>
                <Image
                  width="100%"
                  height="120px"
                  preview={false}
                  src={bannerforbuy}
                ></Image>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Loading>
  );
}

export default ProductDetailComponent;
