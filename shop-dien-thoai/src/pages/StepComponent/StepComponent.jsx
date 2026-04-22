import { Steps } from "antd";

function StepComponent({ current = 0, items = [] }) {
  // Ant Design v5 dùng prop 'items' thay vì thẻ con <Step />
  return <Steps current={current} items={items} />;
}
export default StepComponent;
