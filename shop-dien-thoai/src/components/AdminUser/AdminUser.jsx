// --- 1. IMPORTS ---
import { Button, Form, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import { getBase64 } from "../../untils";
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

function AdminUser() {
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();

  const [listIdsSelected, setListIdsSelected] = useState([]);
  const [isOpenModalDeleteMany, setIsOpenModalDeleteMany] = useState(false);
  const searchInput = useRef(null);

  // Khởi tạo state với phone là chuỗi rỗng để giữ số 0
  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    password: "",
    address: "",
    avatar: "",
  });
  const [stateUserDetail, setStateUserDetail] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    address: "",
    avatar: "",
  });

  // --- 2. QUERIES ---
  const {
    isFetching,
    isLoading,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getAllUser(user.access_token),
  });

  const fetchDetailUser = async (id, token) => {
    setIsLoadingUpdate(true);
    const res = await UserService.getDetailsUser(id, token);
    if (res.data) {
      setStateUserDetail({ ...res.data });
    }
    setIsLoadingUpdate(false);
  };

  // --- 3. MUTATIONS ---
  const mutation = useMutationHook((data) => UserService.registerUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    return UserService.updateUser(id, rests, token);
  });
  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdate,
    isError: isErroUpdate,
  } = mutationUpdate;

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    return UserService.deleteUser(id, token);
  });
  const {
    isPending: isPendingDelete,
    data: dataDelete,
    isSuccess: isSuccesDelete,
    isError: isErrorDelete,
  } = mutationDelete;

  const mutationDeleteMany = useMutationHook((data) => {
    const { id, token } = data;
    return UserService.deleteMany(id, token);
  });
  const {
    data: dataDelelteMany,
    isSuccess: isSuccesDeleteMany,
    isError: isErrorDeleteMany,
  } = mutationDeleteMany;

  // --- 4. HANDLERS ---
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateUser({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
      password: "",
      address: "",
      avatar: "",
    });
    form.resetFields();
  }, [form]);

  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStateUserDetail({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
      address: "",
      avatar: "",
    });
    formUpdate.resetFields();
  }, [formUpdate]);

  const onFinish = () => {
    mutation.mutate(stateUser);
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate({
      id: stateUserDetail._id,
      token: user?.access_token,
      ...stateUserDetail,
    });
  };

  const handleOnchange = (e) => {
    setStateUser({ ...stateUser, [e.target.name]: e.target.value });
  };

  const handleOnchangeDetail = (e) => {
    setStateUserDetail({ ...stateUserDetail, [e.target.name]: e.target.value });
  };

  const handleOnchangeAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (file && !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetail({ ...stateUserDetail, avatar: file?.preview || "" });
  };

  const handleDetailUser = (id) => {
    if (id) {
      fetchDetailUser(id, user.access_token);
    }
    setIsOpenDrawer(true);
  };

  const handleConfirmDelete = () => {
    if (rowSelected) {
      mutationDelete.mutate({ id: rowSelected, token: user.access_token });
    }
  };

  const handleConfirmDeleteMany = () => {
    if (listIdsSelected?.length > 0) {
      mutationDeleteMany.mutate({
        id: listIdsSelected,
        token: user?.access_token,
      });
    }
  };

  // --- 5. SIDE EFFECTS ---
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Tạo người dùng thành công");
      queryClient.invalidateQueries(["users"]);
      handleCancel();
    } else if (isError || data?.status === "ERR") {
      message.error(data?.message || "Lỗi khi tạo người dùng");
    }
  }, [isSuccess, data, isError, handleCancel, queryClient]);

  useEffect(() => {
    if (isSuccessUpdate && dataUpdated?.status === "OK") {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries(["users"]);
      handleCloseDrawer();
    } else if (isErroUpdate) {
      message.error("Lỗi khi cập nhật");
    }
  }, [
    isSuccessUpdate,
    dataUpdated,
    isErroUpdate,
    handleCloseDrawer,
    queryClient,
  ]);

  useEffect(() => {
    if (isSuccesDelete && dataDelete?.status === "OK") {
      message.success("Đã xoá người dùng");
      queryClient.invalidateQueries(["users"]);
      setIsModalOpenDelete(false);
    }
  }, [isSuccesDelete, dataDelete, queryClient]);

  useEffect(() => {
    if (isSuccesDeleteMany && dataDelelteMany?.status === "OK") {
      message.success("Đã xoá thành công các mục chọn");
      queryClient.invalidateQueries(["users"]);
      setListIdsSelected([]);
      setIsOpenModalDeleteMany(false);
    }
  }, [isSuccesDeleteMany, dataDelelteMany, queryClient]);

  useEffect(() => {
    if (stateUserDetail && isOpenDrawer) {
      formUpdate.setFieldsValue(stateUserDetail);
    }
  }, [formUpdate, stateUserDetail, isOpenDrawer]);

  const dataTable = users?.data?.map((u) => ({ ...u, key: u._id })) || [];
  // --- 6. TABLE CONFIG ---
  const columns = [
    {
      title: "Tên người dùng",
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
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      render: (isAdmin) => (isAdmin ? "True" : "False"),
    },
    { title: "Số điện thoại", dataIndex: "phone" },
    { title: "Địa chỉ", dataIndex: "address" },
    {
      title: "Action",
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
            onClick={() => {
              setRowSelected(record._id);
              setIsModalOpenDelete(true);
            }}
          />
          <EditOutlined
            style={{ fontSize: "20px", color: "orange", cursor: "pointer" }}
            onClick={() => handleDetailUser(record._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <WrapperHeader>Quản lí người dùng</WrapperHeader>

      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <Button
          onClick={() => setIsModalOpen(true)}
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>

      {listIdsSelected.length > 0 && (
        <ButtonComponent
          onClick={() => setIsOpenModalDeleteMany(true)}
          styleButton={{
            marginTop: "10px",
            marginBottom: "10px",
            backgroundColor: "red",
            color: "#fff",
          }}
        >
          Xoá các mục đã chọn ({listIdsSelected.length})
        </ButtonComponent>
      )}

      <Loading isLoading={isLoading}>
        <TableComponent
          isLoading={isFetching}
          columns={columns}
          data={dataTable}
          rowSelection={{
            selectedRowKeys: listIdsSelected,
            onChange: (keys) => setListIdsSelected(keys),
          }}
          pagination={{ pageSize: 5 }}
        />
      </Loading>

      {/* --- MODAL TẠO MỚI --- */}
      <ModalComponent
        title="Thêm người dùng"
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
              label="Tên nguời dùng"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <InputComponent
                value={stateUser.name}
                onChange={handleOnchange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <InputComponent
                value={stateUser.email}
                onChange={handleOnchange}
                name="email"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
              ]}
            >
              <InputComponent
                type="password"
                value={stateUser.password}
                onChange={handleOnchange}
                name="password"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập SĐT!" },
                { pattern: /^\d{10}$/, message: "SĐT phải có đúng 10 chữ số!" },
              ]}
            >
              <InputComponent
                value={stateUser.phone}
                onChange={handleOnchange}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <InputComponent
                value={stateUser.address}
                onChange={handleOnchange}
                name="address"
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit">
                Tạo mới
              </Button>
            </div>
          </Form>
        </Loading>
      </ModalComponent>

      {/* --- DRAWER CẬP NHẬT --- */}
      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={handleCloseDrawer}
        size="large"
      >
        <Loading isLoading={isLoadingUpdate}>
          <Form
            form={formUpdate}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdateUser}
            autoComplete="off"
          >
            <Form.Item
              label="Tên người dùng"
              name="name"
              rules={[{ required: true, message: "Không được để trống tên!" }]}
            >
              <InputComponent
                value={stateUserDetail.name}
                onChange={handleOnchangeDetail}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Không được để trống email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <InputComponent
                value={stateUserDetail.email}
                onChange={handleOnchangeDetail}
                name="email"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Không được để trống SĐT!" },
                { pattern: /^\d{10}$/, message: "SĐT phải đủ 10 số!" },
              ]}
            >
              <InputComponent
                value={stateUserDetail.phone}
                onChange={handleOnchangeDetail}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Không được để trống địa chỉ!" },
              ]}
            >
              <InputComponent
                value={stateUserDetail.address}
                onChange={handleOnchangeDetail}
                name="address"
              />
            </Form.Item>

            <Form.Item label="Ảnh đại diện" name="avatar">
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetail}
                maxCount={1}
                beforeUpload={() => false}
                showUploadList={false}
              >
                <Button>Thay đổi ảnh</Button>
                {stateUserDetail.avatar && (
                  <img
                    src={stateUserDetail.avatar}
                    style={{
                      height: "80px",
                      width: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "20px",
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button type="primary" htmlType="submit">
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </Loading>
      </DrawerComponent>

      {/* --- MODAL XOÁ --- */}
      <ModalComponent
        title="Xoá người dùng"
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        onOk={handleConfirmDelete}
        confirmLoading={isPendingDelete}
      >
        <div>Bạn có chắc chắn muốn xoá người dùng này không?</div>
      </ModalComponent>

      <ModalComponent
        title="Xác nhận xoá hàng loạt"
        open={isOpenModalDeleteMany}
        onCancel={() => setIsOpenModalDeleteMany(false)}
        onOk={handleConfirmDeleteMany}
      >
        <Loading isLoading={isPending}>
          <div>
            Bạn có chắc chắc muốn xoá {listIdsSelected.length} người dùng đã
            chọn không?
          </div>
        </Loading>
      </ModalComponent>
    </div>
  );
}

export default AdminUser;
