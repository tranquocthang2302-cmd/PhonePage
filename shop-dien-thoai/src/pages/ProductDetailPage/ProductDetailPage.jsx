import { useParams } from "react-router-dom";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";

function ProductDetailPage() {
  const param = useParams();
  const { id } = param;
  return (
    <div
      style={{
        width: "100%",
        background: "var(--color-container)",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        padding: "10px 0",
      }}
    >
      <ProductDetailComponent idProduct={id}></ProductDetailComponent>
    </div>
  );
}

export default ProductDetailPage;
