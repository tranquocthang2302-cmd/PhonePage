import { Input } from "antd";

function InputComponent({ size, placeholder, style, ...rest }) {
  return (
    <Input
      size={size}
      placeholder={placeholder}
      // Ưu tiên style được truyền từ bên ngoài vào
      style={style}
      {...rest}
    />
  );
}

export default InputComponent;
