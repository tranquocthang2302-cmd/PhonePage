import { Button, Form, Input, Select, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import * as ProductService from "../../services/ProductService";
import { useMutationHook } from "../../hooks/useMutationHook";
import { getBase64, renderOptions } from "../../untils";

import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import Loading from "../LoaddingComponent/Loadding";
import * as message from "../../components/Message/Message";

import { WrapperHeader } from "../AdminUser/style";
import { WrapperUploadFile } from "./style";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

function AdminProduct() {
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [listIdsSelected, setListIdsSelected] = useState([]);

  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
  });
  const [stateProductDetail, setStateProductDetial] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
    discount: "",
  });
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();

  const [isOpenModalDeleteMany, setIsOpenModalDeleteMany] = useState(false);
  const [typeSelect, setTypeSelect] = useState("");
  const [typeSelectDetail, setTypeSelectDetail] = useState("");
  const searchInput = useRef(null);

  // --- QUERIES & MUTATIONS ---
  const {
    isFetching,
    isLoading,
    data: products,
  } = useQuery({
    queryKey: ["products"],
    queryFn: ProductService.getAllProduct,
  });

  const { data: types } = useQuery({
    queryKey: ["types"],
    queryFn: ProductService.getAllTypeProduct,
  });

  const fetchGetDetialsProduct = async (id) => {
    setIsLoadingUpdate(true);
    const res = await ProductService.getDetailProduct(id);
    if (res.data) {
      setStateProductDetial({ ...res.data });
    }
    setIsLoadingUpdate(false);
  };

  const mutation = useMutationHook((data) =>
    ProductService.createProduct(data),
  );
  const { data, isPending, isSuccess, isError } = mutation;

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    return ProductService.updateProduct(id, rests, token);
  });
  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdate,
    isError: isErroUpdate,
  } = mutationUpdate;

  const mutationDelete = useMutationHook((data) =>
    ProductService.deleteProduct(data.id, data.token),
  );
  const {
    data: dataDelelte,
    isSuccess: isSuccesDelete,
    isError: isErrorDelte,
  } = mutationDelete;

  const mutationDeleteMany = useMutationHook((data) =>
    ProductService.deleteManyProduct(data.id, data.token),
  );
  const {
    data: dataDelelteMany,
    isSuccess: isSuccesDeleteMany,
    isError: isErrorDeleteMany,
  } = mutationDeleteMany;

  // --- HANDLERS ---
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setTypeSelect("");
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
    });
    form.resetFields();
  }, [form]);

  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setTypeSelectDetail("");
    setStateProductDetial({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      discount: "",
    });
    formUpdate.resetFields();
  }, [formUpdate]);

  const onFinish = () => mutation.mutate(stateProduct);
  const handleOnchange = (e) =>
    setStateProduct({ ...stateProduct, [e.target.name]: e.target.value });
  const handleOnchangeDetail = (e) =>
    setStateProductDetial({
      ...stateProductDetail,
      [e.target.name]: e.target.value,
    });

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj);
    setStateProduct({ ...stateProduct, image: file?.preview || "" });
  };

  const handleOnchangeAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj);
    setStateProductDetial({
      ...stateProductDetail,
      image: file?.preview || "",
    });
  };

  const handleDeatilProduct = (id) => {
    if (id) fetchGetDetialsProduct(id);
    setIsOpenDrawer(true);
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate({
      id: stateProductDetail._id,
      token: user?.access_token,
      ...stateProductDetail,
    });
  };

  const handleOpenModalDeleteProduct = (id) => {
    setIsModalOpenDelete(true);
    setRowSelected(id);
  };
  const handleConfirmDelete = () => {
    if (rowSelected)
      mutationDelete.mutate({ id: rowSelected, token: user.access_token });
  };
  const handleCancelDelete = useCallback(() => {
    setIsModalOpenDelete(false);
    setRowSelected("");
  }, []);
  const handleSearch = (selectedKeys, confirm) => confirm();
  const handleReset = (clearFilters) => clearFilters();

  const handleOpenModalDeleteMany = useCallback(() => {
    if (listIdsSelected.length > 0) setIsOpenModalDeleteMany(true);
  }, [listIdsSelected]);
  const handleCancelDeleteMany = useCallback(() => {
    setListIdsSelected([]);
    setIsOpenModalDeleteMany(false);
  }, []);
  const handleConfirmDeleteMany = () => {
    if (listIdsSelected?.length > 0)
      mutationDeleteMany.mutate({
        id: listIdsSelected,
        token: user?.access_token,
      });
  };

  const handleChangeSelect = (value) => {
    if (value !== "add_type") {
      setStateProduct({ ...stateProduct, type: value });
      setTypeSelect("");
    } else {
      setTypeSelect("add_type");
      setStateProduct({ ...stateProduct, type: "" });
    }
  };

  const handleChangeSelectDetail = (value) => {
    if (value !== "add_type") {
      setStateProductDetial({ ...stateProductDetail, type: value });
      setTypeSelectDetail("");
      formUpdate.setFieldsValue({ type: value });
    } else {
      setTypeSelectDetail("add_type");
      setStateProductDetial({ ...stateProductDetail, type: "" });
      formUpdate.setFieldsValue({ type: "" });
    }
  };

  // --- SIDE EFFECTS ---
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Tạo thành công");
      queryClient.invalidateQueries(["products"]);
      handleCancel();
    } else if (isError) message.error("Lỗi khi tạo sản phẩm");
  }, [isSuccess, data, isError, handleCancel, queryClient]);

  useEffect(() => {
    if (isSuccessUpdate && dataUpdated?.status === "OK") {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries(["products"]);
      handleCloseDrawer();
    } else if (isErroUpdate) message.error("Lỗi khi cập nhật");
  }, [
    isSuccessUpdate,
    dataUpdated,
    isErroUpdate,
    handleCloseDrawer,
    queryClient,
  ]);

  useEffect(() => {
    if (isSuccesDelete && dataDelelte?.status === "OK") {
      message.success("Đã xoá sản phẩm");
      queryClient.invalidateQueries(["products"]);
      handleCancelDelete();
    } else if (isErrorDelte) message.error("Lỗi khi xoá");
  }, [
    isSuccesDelete,
    dataDelelte,
    isErrorDelte,
    handleCancelDelete,
    queryClient,
  ]);

  useEffect(() => {
    if (isSuccesDeleteMany && dataDelelteMany?.status === "OK") {
      message.success("Đã xoá tất cả sản phẩm đã chọn");
      queryClient.invalidateQueries(["products"]);
      handleCancelDeleteMany();
    } else if (isErrorDeleteMany) message.error("Lỗi khi xoá");
  }, [
    isSuccesDeleteMany,
    dataDelelteMany,
    isErrorDeleteMany,
    handleCancelDeleteMany,
    queryClient,
  ]);

  useEffect(() => {
    if (stateProductDetail) formUpdate.setFieldsValue(stateProductDetail);
  }, [formUpdate, stateProductDetail]);

  // --- TABLE COLUMNS (GIỮ NGUYÊN CỦA BẠN) ---
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });
  const dataTable =
    products?.data.map((product) => ({ ...product, key: product._id })) || [];
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      render: (text) => (
        <span style={{ color: "#1677ff", fontWeight: "500" }}>{text}</span>
      ),
      // Tạo danh sách lọc
      filters: Array.from(new Set(dataTable.map((item) => item.name)))
        .filter((name) => name) // Loại bỏ trường hợp tên bị null/undefined
        .map((name) => ({
          text: name,
          value: name,
        })),

      filterSearch: true, // Thêm dòng này để hiện ô Search trong menu lọc

      // Giới hạn chiều cao của Menu lọc (Mặc định Antd đã có, nhưng có thể chỉnh thêm nếu muốn)
      filterMultiple: true, // Cho phép chọn lọc nhiều người cùng lúc

      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <span style={{ fontWeight: "500" }}>
          {Number(price)?.toLocaleString()}
        </span>
      ),
      filters: [
        { text: "=> 50", value: ">=" },
        { text: "<= 50", value: "<" },
      ],
      onFilter: (value, record) =>
        value === ">=" ? record.price >= 50 : record.price < 50,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      render: (discount) => <span>{discount ? `${discount}%` : "0%"}</span>,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      onFilter: (value, record) =>
        value === ">=" ? record.rating >= 3 : record.rating < 3,
    },
    { title: "Danh mục", dataIndex: "type" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (image) => (
        <img
          src={image}
          alt="product"
          style={{
            height: "60px",
            width: "60px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #eee",
          }}
        />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_, record) => (
        <div>
          <DeleteOutlined
            style={{
              fontSize: "20px",
              color: "red",
              marginRight: "8px",
              cursor: "pointer",
            }}
            onClick={() => handleOpenModalDeleteProduct(record._id)}
          />
          <EditOutlined
            style={{ fontSize: "20px", color: "orange", cursor: "pointer" }}
            onClick={() => handleDeatilProduct(record._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", borderRadius: "8px" }}>
      <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          onClick={() => setIsModalOpen(true)}
          style={{ height: "150px", width: "150px", borderStyle: "dashed" }}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>

      {dataTable.length ? (
        <ButtonComponent
          onClick={handleOpenModalDeleteMany}
          styleButton={{ marginTop: "10px" }}
          disabled={listIdsSelected.length === 0}
        >
          Xoá các mục đã chọn ({listIdsSelected.length})
        </ButtonComponent>
      ) : null}

      <div>
        <TableComponent
          isLoading={isLoading || isFetching}
          columns={columns}
          data={dataTable}
          rowSelection={{
            selectedRowKeys: listIdsSelected,
            onChange: (keys) => setListIdsSelected(keys),
          }}
          pagination={{
            pageSize: 5,
            position: ["bottomCenter"],
            showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
          }}
        />

        {/* MODAL TẠO MỚI */}
        <ModalComponent
          forceRender
          title="Tạo sản phẩm"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Loading isLoading={isPending}>
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <InputComponent
                  value={stateProduct.name}
                  onChange={handleOnchange}
                  name="name"
                />
              </Form.Item>

              <Form.Item
                label="Loại sản phẩm"
                name="type"
                rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
              >
                <Select
                  value={stateProduct.type}
                  onChange={handleChangeSelect}
                  options={renderOptions(types?.data)}
                />
              </Form.Item>

              {typeSelect === "add_type" && (
                <Form.Item
                  label="Thêm loại"
                  rules={[
                    { required: true, message: "Vui lòng nhập loại mới!" },
                  ]}
                >
                  <InputComponent
                    value={stateProduct.type}
                    onChange={handleOnchange}
                    name="type"
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Số lượng tồn"
                name="countInStock"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng!" },
                  { pattern: /^[0-9]+$/, message: "Phải là số nguyên dương!" },
                ]}
              >
                <InputComponent
                  value={stateProduct.countInStock}
                  onChange={handleOnchange}
                  name="countInStock"
                />
              </Form.Item>

              <Form.Item
                label="Giá sản phẩm"
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá!" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      if (isNaN(value))
                        return Promise.reject(new Error("Giá phải là số!"));
                      if (Number(value) <= 0)
                        return Promise.reject(new Error("Giá phải lớn hơn 0!"));
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.price}
                  onChange={handleOnchange}
                  name="price"
                />
              </Form.Item>

              <Form.Item
                label="Đánh giá"
                name="rating"
                rules={[
                  { required: true, message: "Vui lòng nhập rating!" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const num = Number(value);
                      if (isNaN(num))
                        return Promise.reject(new Error("Rating phải là số!"));
                      if (num < 1 || num > 5)
                        return Promise.reject(new Error("Rating từ 1 đến 5!"));
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.rating}
                  onChange={handleOnchange}
                  name="rating"
                />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input.TextArea
                  rows={4}
                  value={stateProduct.description}
                  onChange={handleOnchange}
                  name="description"
                />
              </Form.Item>

              <Form.Item
                label="Hình ảnh"
                name="image"
                rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
              >
                <WrapperUploadFile
                  onChange={handleOnchangeAvatar}
                  maxCount={1}
                  beforeUpload={() => false}
                  showUploadList={false}
                >
                  <Button style={{ width: "150px" }}>Select File</Button>
                  {stateProduct.image && (
                    <img
                      src={stateProduct.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt="avatar"
                    />
                  )}
                </WrapperUploadFile>
              </Form.Item>

              <Form.Item
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>

        {/* DRAWER CẬP NHẬT */}
        <DrawerComponent
          forceRender
          title="Sửa sản phẩm"
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          size="large"
        >
          <Loading isLoading={isLoadingUpdate}>
            <Form
              form={formUpdate}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={onUpdateProduct}
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <InputComponent
                  value={stateProductDetail.name}
                  onChange={handleOnchangeDetail}
                  name="name"
                />
              </Form.Item>

              <Form.Item
                label="Loại sản phẩm"
                name="type"
                rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
              >
                <Select
                  value={stateProductDetail.type}
                  onChange={handleChangeSelectDetail}
                  options={renderOptions(types?.data)}
                />
              </Form.Item>

              {typeSelectDetail === "add_type" && (
                <Form.Item
                  label="Thêm mới"
                  rules={[
                    { required: true, message: "Vui lòng nhập loại mới!" },
                  ]}
                >
                  <InputComponent
                    value={stateProductDetail.type}
                    onChange={handleOnchangeDetail}
                    name="type"
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Số lượng tồn kho"
                name="countInStock"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng!" },
                  { pattern: /^[0-9]+$/, message: "Phải là số nguyên dương!" },
                ]}
              >
                <InputComponent
                  value={stateProductDetail.countInStock}
                  onChange={handleOnchangeDetail}
                  name="countInStock"
                />
              </Form.Item>

              <Form.Item
                label="Giá"
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá!" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      if (isNaN(value))
                        return Promise.reject(new Error("Giá phải là số!"));
                      if (Number(value) <= 0)
                        return Promise.reject(new Error("Giá phải lớn hơn 0!"));
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetail.price}
                  onChange={handleOnchangeDetail}
                  name="price"
                />
              </Form.Item>

              <Form.Item
                label="Đánh giá (theo số sao): "
                name="rating"
                rules={[
                  { required: true, message: "Vui lòng nhập rating!" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const num = Number(value);
                      if (isNaN(num))
                        return Promise.reject(new Error("Rating phải là số!"));
                      if (num < 1 || num > 5)
                        return Promise.reject(new Error("Rating từ 1 đến 5!"));
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputComponent
                  value={stateProductDetail.rating}
                  onChange={handleOnchangeDetail}
                  name="rating"
                />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input.TextArea
                  rows={4}
                  value={stateProductDetail.description}
                  onChange={handleOnchangeDetail}
                  name="description"
                />
              </Form.Item>

              <Form.Item
                label="Giảm giá (%)"
                name="discount"
                rules={[{ pattern: /^[0-9]+$/, message: "Phải là số!" }]}
              >
                <InputComponent
                  value={stateProductDetail.discount}
                  onChange={handleOnchangeDetail}
                  name="discount"
                />
              </Form.Item>

              <Form.Item label="Hình ảnh" name="image">
                <WrapperUploadFile
                  onChange={handleOnchangeAvatarDetail}
                  maxCount={1}
                  beforeUpload={() => false}
                  showUploadList={false}
                >
                  <Button>Select File</Button>
                  {stateProductDetail.image && (
                    <img
                      src={stateProductDetail.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </WrapperUploadFile>
              </Form.Item>

              <Form.Item
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button type="primary" htmlType="submit">
                  Apply Changes
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>

        {/* MODALS XOÁ */}
        <ModalComponent
          forceRender
          title="Xoá sản phẩm"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleConfirmDelete}
        >
          <Loading isLoading={isPending}>
            <div>Bạn có chắc chắc muốn xoá sản phẩm này không?</div>
          </Loading>
        </ModalComponent>
        <ModalComponent
          forceRender
          title="Xác nhận xoá hàng loạt"
          open={isOpenModalDeleteMany}
          onCancel={handleCancelDeleteMany}
          onOk={handleConfirmDeleteMany}
        >
          <Loading isLoading={isPending}>
            <div>
              Bạn có chắc chắc muốn xoá {listIdsSelected.length} sản phẩm đã
              chọn không?
            </div>
          </Loading>
        </ModalComponent>
      </div>
    </div>
  );
}

export default AdminProduct;
