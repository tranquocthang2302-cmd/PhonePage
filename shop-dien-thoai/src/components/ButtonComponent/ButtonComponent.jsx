import { Button } from "antd";

function ButtonComponent({
  className,
  type,
  disabled,
  size,
  styleButton = {}, // Đặt mặc định là object rỗng để tránh lỗi crash
  styleTextButton,
  textButton,
  children,
  icon,
  ...rest
}) {
  return (
    <Button
      className={className}
      type={type}
      size={size}
      disabled={disabled}
      // Sửa cú pháp style ở đây
      style={{
        ...styleButton,
      }}
      icon={icon}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default ButtonComponent;
