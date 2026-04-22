import { message } from "antd";
const success = (mes = "Đăng ký thành công") => {
  message.success(mes);
};
const error = (mes = "Có lỗi khi đăng ký") => {
  message.error(mes);
};
const warning = (mes = "Warning") => {
  message.warning(mes);
};
export { success, error, warning };
