// --- 1. IMPORTS (Thư viện -> Hooks/Services -> Components -> Assets -> Styles) ---
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import * as ProductService from "../../services/ProductService";

import SilderComponent from "../../components/SliderComponent/SilderComponent";
import TypeProduct from "../../components/TypeProduct/TypeProducts";
import CardComponent from "../../components/CardComponent/CardComponent";

import slider1 from "../../assets/images/Slider1.avif";
import slider2 from "../../assets/images/Slider2.avif";
import slider3 from "../../assets/images/Slider3.avif";
import slider4 from "../../assets/images/Slider4.avif";
import slider5 from "../../assets/images/Slider5.avif";
import slider6 from "../../assets/images/Slider6.avif";

import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from "./style";
import Loading from "../../components/LoaddingComponent/Loadding";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

function HomePage() {
  // --- 2. CONSTANTS (Dữ liệu cố định) ---
  const searchProduct = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProduct, 1000);

  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const arrImages = [slider1, slider2, slider3, slider4, slider5, slider6];
  const [typeProducts, setTypeProduct] = useState([]);
  // --- 3. LOGIC FETCHING (API & React Query) ---
  const fetchProductAll = async (search, limit) => {
    setLoading(true); // Bật ở đầu hàm

    const res = await ProductService.getAllProduct(search, limit);

    setLoading(false); // Tắt ở cuối hàm
    return res;
  };

  const { isLoading, data: products } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: () => fetchProductAll(searchDebounce, limit),
    retry: 3,
    retryDelay: 1000,
    placeholderData: keepPreviousData,
  });

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res.status === "OK") {
      setTypeProduct(res?.data);
    }
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  // --- 4. RETURN JSX (Giao diện) ---
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "var(--color-container)",
          paddingBottom: "20px",
        }}
      >
        {/* Section 1: Menu phân loại */}
        <div
          style={{
            display: "flex",
            width: "100%",
            background: "var(--white-color)",
            justifyContent: "center",
          }}
        >
          <WrapperTypeProduct>
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WrapperTypeProduct>
        </div>

        {/* Section 2: Container nội dung chính */}
        <Loading isLoading={isLoading || loading}>
          <div
            id="container"
            style={{
              width: "1270px",
              borderRadius: "8px",
              marginTop: "20px",
              boxShadow: "0 3px 12px rgba(0, 0, 0, .13)",
              backgroundColor: "var(--white-color)",
              padding: "10px 0",
            }}
          >
            {/* Slider Banner */}
            <SilderComponent arrImages={arrImages} />
            <WrapperProduct>
              {products?.data?.length > 0
                ? products?.data?.map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      newPrice={product.newPrice}
                      id={product._id}
                    />
                  ))
                : /* Trường hợp 2: Load xong rồi mà mảng rỗng thì báo lỗi */
                  !isLoading && (
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        padding: "40px",
                        fontSize: "18px",
                        color: "#999",
                        fontStyle: "italic",
                      }}
                    >
                      Không có sản phẩm nào phù hợp với tìm kiếm của bạn.
                    </div>
                  )}
            </WrapperProduct>
            {products?.data?.length > 0 && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <WrapperButtonMore
                  disabled={products.total === products.data.length}
                  textButton="Xem thêm"
                  type="outlie"
                  onClick={() => {
                    setLimit((prev) => prev + 5);
                  }}
                  styleButton={{
                    border: "1px solid var(--primary-color)",
                    backgroundColor: "white",
                    width: "240px",
                    height: "38px",
                    borderRadius: "4px",
                  }}
                  styleTextButton={{
                    color: "var(--primary-color)",
                    fontWeight: "600",
                  }}
                >
                  <span>Xem thêm</span>
                </WrapperButtonMore>
              </div>
            )}
          </div>
        </Loading>
      </div>
    </>
  );
}

export default HomePage;
