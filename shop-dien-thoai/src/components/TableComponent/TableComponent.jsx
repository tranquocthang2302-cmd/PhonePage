import { Divider, Table } from "antd";
import Loading from "../LoaddingComponent/Loadding";

function TableComponent(props) {
  const {
    selectionType = "checkbox",
    data = [],
    columns = [],
    isLoading = false,
    rowSelection,
    pagination, // Hứng prop pagination từ AdminProduct truyền sang
    ...rests
  } = props;

  return (
    <div>
      <Divider />
      <Loading isLoading={isLoading}>
        <Table
          // 1. Logic chọn nhiều (Checkboxes)
          rowSelection={
            rowSelection
              ? {
                  type: selectionType,
                  ...rowSelection,
                }
              : null
          }
          // 2. Cột và Dữ liệu
          columns={columns}
          dataSource={data}
          // 3. Phân trang (Lấy cấu hình 5 sản phẩm từ cha truyền xuống)
          pagination={pagination}
          // 4. Các props khác nếu có
          {...rests}
        />
      </Loading>
    </div>
  );
}

export default TableComponent;
