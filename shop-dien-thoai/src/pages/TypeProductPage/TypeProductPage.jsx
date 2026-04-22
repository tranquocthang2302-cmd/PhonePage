import React, { useEffect, useState } from "react";
import { Col, Pagination, Row } from "antd";
import { useLocation } from "react-router-dom";
import * as ProductSerVice from "../../services/ProductService";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import Loading from "../../components/LoaddingComponent/Loadding";
import { WrapperNavbar, WrapperProduct } from "./style";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

function TypeProductPage() {
  const location = useLocation();
  const { state } = location; // Đây là 'type' sản phẩm từ Navbar truyền sang
  const searchProduct = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Quản lý phân trang (State local)
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 8, // Hiển thị 8 sản phẩm theo yêu cầu
    total: 0,
  });

  // 2. Hàm gọi API lấy sản phẩm theo loại và phân trang
  const fetchProductOfType = async (type, page, limit) => {
    setLoading(true);
    // Lưu ý: đảm bảo Service đã được sửa để nhận (type, page, limit)
    const res = await ProductSerVice.getProductOfType(type, page, limit);
    if (res?.status === "OK") {
      setProducts(res?.data);
      setPaginate((prev) => ({
        ...prev,
        total: res?.total, // Cập nhật tổng số sản phẩm để chia trang
      }));
    } else {
      setProducts([]);
    }
    setLoading(false);
  };

  // 3. Effect chạy khi đổi Loại sản phẩm (Click menu khác)

  useEffect(() => {
    if (state) {
      // Khi đổi loại, luôn reset về trang 0
      setPaginate((prev) => ({ ...prev, page: 0 }));
      fetchProductOfType(state, 0, paginate.limit);
    }
  }, [state, paginate.limit]);

  // 4. Hàm xử lý khi người dùng click số trang hoặc mũi tên
  const handleOnChangePage = (current, pageSize) => {
    const newPage = current - 1; // Antd (1,2,3) -> Backend (0,1,2)
    setPaginate((prev) => ({ ...prev, page: newPage }));
    fetchProductOfType(state, newPage, pageSize);

    // Cuộn lên đầu trang cho đẹp
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductSerVice.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  return (
    <Loading isLoading={loading}>
      <div
        style={{
          backgroundColor: "var(--color-container)",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Row
          style={{
            width: "1270px",
            flexWrap: "nowrap",
            background: "var(--white-color)",
            borderRadius: "4px",
            padding: "20px",
          }}
        >
          <WrapperNavbar span={4}>
            <NavbarComponent types={typeProducts} />
          </WrapperNavbar>

          <Col
            span={20}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Danh sách sản phẩm */}
            <WrapperProduct>
              {products
                ?.filter((pro) => {
                  if (searchDebounce === "") {
                    return true;
                  }
                  if (
                    pro?.name
                      ?.toLowerCase()
                      .includes(searchDebounce.toLowerCase())
                  ) {
                    return true;
                  }
                  // Dòng này cực kỳ quan trọng để sửa lỗi:
                  return false;
                })
                .map((product) => (
                  <CardComponent
                    key={product._id}
                    // ... giữ nguyên các props bên dưới
                    id={product._id}
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
                  />
                ))}
            </WrapperProduct>

            {/* Thanh phân trang chuyên nghiệp */}
            {paginate.total > paginate.limit && (
              <Pagination
                showQuickJumper
                current={paginate.page + 1}
                total={paginate.total}
                pageSize={paginate.limit}
                onChange={handleOnChangePage}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                  paddingBottom: "20px",
                }}
              />
            )}

            {products.length === 0 && !loading && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "50px",
                  fontSize: "1.2rem",
                }}
              >
                Không có sản phẩm nào thuộc loại này.
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Loading>
  );
}

export default TypeProductPage;
