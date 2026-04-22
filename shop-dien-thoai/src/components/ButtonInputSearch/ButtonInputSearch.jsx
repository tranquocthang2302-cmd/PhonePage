import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
function ButtonInputSearch(props) {
  const {
    size,
    placeholder,
    children,
    type,
    onClick,
    onChange, // <--- LẤY ONCHANGE TỪ PROPS RA
    textButton,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(250,230,234)",
    border = "none",
    borderRadius = "0px", // Nên có đơn vị px
    colorButton = "rgb(190,30,45)",
  } = props;

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: backgroundColorInput,
        borderRadius: borderRadius,
      }}
    >
      <InputComponent
        size={size}
        placeholder={placeholder}
        onChange={onChange}
        // Truyền thẳng style xuống
        style={{
          backgroundColor: backgroundColorInput,
          borderRadius: "0px", // Để 0px vì ta sẽ bo ở cái div bao ngoài
          border: border,
        }}
      />
      <ButtonComponent
        type={type}
        size={size}
        textButton={textButton}
        styleTextButton={{ colorButton }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        styleButton={{
          borderRadius: "0px", // Để 0px để dính liền với Input
          border: border,
          backgroundColor: backgroundColorButton,
          color: colorButton,
          outline: "none",
        }}
        onClick={onClick}
      >
        {children}
      </ButtonComponent>
    </div>
  );
}

export default ButtonInputSearch;
