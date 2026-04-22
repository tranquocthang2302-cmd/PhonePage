import { WrapperInputStyle } from "./styled";
function InputFormComponent(props) {
  const { placeholder = "Nhập text", type = "text", style, ...rest } = props;

  return (
    <WrapperInputStyle
      type={type}
      placeholder={placeholder}
      style={style}
      {...rest}
    />
  );
}

export default InputFormComponent;
