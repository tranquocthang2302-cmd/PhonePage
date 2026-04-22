import { useNavigate } from "react-router-dom";
import { WrapperProduct } from "./style";

function TypeProduct({ name }) {
  const navigate = useNavigate();
  const handleNavigate = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "_")}`,
      {
        state: type,
      },
    );
  };
  return (
    <WrapperProduct
      onClick={() => {
        handleNavigate(name);
      }}
    >
      {name}
    </WrapperProduct>
  );
}

export default TypeProduct;
