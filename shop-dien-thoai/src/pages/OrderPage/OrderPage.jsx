import React, { useEffect, useMemo, useState } from "react";
import { Checkbox, Empty, Form, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  OrderContainer,
  OrderWrapper,
  OrderTitle,
  ColLeft,
  ColRight,
  OrderHeader,
  HeaderCheckbox,
  OrderItemList,
  OrderItem,
  OrderItemInfo,
  OrderItemImg,
  OrderItemName,
  OrderItemPrice,
  PriceCurrent,
  OrderItemQuantity,
  OrderItemTotal,
  OrderSummary,
  SummaryInfo,
  SummaryLine,
  SummaryTotalWrapper,
  TotalLabel,
  TotalValue,
  TotalAmount,
  TotalVAT,
  BtnOrderSubmit,
  WrapperAddress,
  OrderPriceDelivery,
} from "./style";
import { useDispatch, useSelector } from "react-redux";

import {
  handleChangeCount,
  removeOrderProduct,
  removeManyOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../untils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoaddingComponent/Loadding";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import StepComponent from "../StepComponent/StepComponent";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [form] = Form.useForm();
  const navigtae = useNavigate();
  const [stateUserDetail, setStateUserDetail] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const userOrderItems = useMemo(() => {
    return order?.orderItems?.filter((item) => item.user === user?.id) || [];
  }, [order?.orderItems, user?.id]);

  const handleOnchangeDetail = (e) => {
    setStateUserDetail({ ...stateUserDetail, [e.target.name]: e.target.value });
  };

  const onChange = (e) => {
    const value = e.target.value;
    console.log(e.target.value);
    if (listChecked.includes(value)) {
      setListChecked(listChecked.filter((item) => item !== value));
    } else {
      setListChecked([...listChecked, value]);
    }
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    return UserService.updateUser(id, rests, token);
  });

  const { isPending } = mutationUpdate;

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const allIds = userOrderItems?.map((item) => item.product);
      setListChecked(allIds);
    } else {
      setListChecked([]);
    }
  };

  const onChangeAmount = (value, idProduct) => {
    const itemOrder = order?.orderItems?.find(
      (item) => item.product === idProduct,
    );
    const currentAmount = Number(value);
    const stock = Number(itemOrder?.countInStock);

    if (currentAmount > stock) {
      message.warning(`Sản phẩm này chỉ còn ${stock} món trong kho`);
      dispatch(handleChangeCount({ idProduct, value: stock }));
    } else {
      dispatch(handleChangeCount({ idProduct, value: currentAmount }));
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
    setListChecked((prev) => prev.filter((id) => id !== idProduct));
  };

  const handleRemoveMany = () => {
    if (listChecked?.length > 0) {
      dispatch(removeManyOrderProduct({ listChecked }));
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked, dispatch]);

  const priceMeMo = useMemo(() => {
    const result = order?.selectedItemOrders?.reduce((total, cur) => {
      return total + Number(cur.price) * Number(cur.amount);
    }, 0);
    return result || 0;
  }, [order?.selectedItemOrders]);

  const deliveryPriceMemo = useMemo(() => {
    if (priceMeMo === 0) return 0;
    if (priceMeMo < 2000000) return 50000;
    if (priceMeMo >= 2000000 && priceMeMo <= 4000000) return 20000;
    return 0;
  }, [priceMeMo]);

  const totalPriceMemo = useMemo(() => {
    return priceMeMo + deliveryPriceMemo;
  }, [priceMeMo, deliveryPriceMemo]);

  const handleAddCard = () => {
    if (!listChecked.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigtae("/payment");
    }
  };

  const handleCancelModalInfo = () => {
    setStateUserDetail({ name: "", phone: "", address: "", city: "" });
    setIsOpenModalUpdateInfo(false);
  };

  const handleConfirmUpdateInfo = () => {
    form.submit();
  };

  const onFinish = () => {
    const { name, address, city, phone } = stateUserDetail;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetail },
        {
          onSuccess: (data) => {
            dispatch(
              updateUser({ ...data?.data, access_token: user?.access_token }),
            );
            setIsOpenModalUpdateInfo(false);
            message.success("Cập nhật thành công!");
          },
        },
      );
    }
  };

  const items = [
    { title: "0 VND", description: "Chưa có sản phẩm" },
    { title: "50.000 VND", description: "Phí ship cơ bản" },
    {
      title: "20.000 VND",
      description: (
        <span style={{ fontSize: "14px", lineHeight: "1.2" }}>
          Giảm phí ship <br /> (Đơn 2tr - 4tr)
        </span>
      ),
    },
    {
      title: "Freeship",
      description: (
        <span style={{ fontSize: "14px", lineHeight: "1.2" }}>
          Đơn hàng từ 4.000.000
        </span>
      ),
    },
  ];

  const currentStep = useMemo(() => {
    if (listChecked.length === 0 || priceMeMo === 0) return 0;
    if (deliveryPriceMemo === 50000) return 1;
    if (deliveryPriceMemo === 20000) return 2;
    if (deliveryPriceMemo === 0 && priceMeMo > 4000000) return 3;
    return 0;
  }, [deliveryPriceMemo, priceMeMo, listChecked]);

  useEffect(() => {
    if (isOpenModalUpdateInfo && user) {
      const userData = {
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
      };
      setStateUserDetail(userData);
      form.setFieldsValue(userData);
    }
  }, [isOpenModalUpdateInfo, user, form]);

  return (
    <OrderContainer>
      <OrderWrapper>
        <OrderTitle>Giỏ hàng</OrderTitle>

        {userOrderItems?.length === 0 ? (
          /* KHI TRỐNG: Hiện thông báo căn giữa toàn bộ trang */
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#fff",
              borderRadius: "4px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span
                  style={{ fontSize: "16px", color: "#666", fontWeight: 500 }}
                >
                  Giỏ hàng của bạn đang trống
                </span>
              }
            >
              <BtnOrderSubmit
                style={{ width: "220px", height: "40px", marginTop: "10px" }}
                onClick={() => navigtae("/")}
              >
                Mua sắm ngay
              </BtnOrderSubmit>
            </Empty>
          </div>
        ) : (
          /* KHI CÓ HÀNG: Hiện đầy đủ 2 cột Left và Right */
          <div style={{ display: "flex", gap: "16px" }}>
            <ColLeft>
              <OrderPriceDelivery>
                <StepComponent current={currentStep} items={items} />
              </OrderPriceDelivery>
              <OrderHeader>
                <div className="name">
                  <HeaderCheckbox>
                    <Checkbox
                      onChange={handleOnchangeCheckAll}
                      checked={
                        listChecked.length === userOrderItems?.length &&
                        userOrderItems?.length > 0
                      }
                    />
                    <span>Tất cả ({userOrderItems.length} sản phẩm)</span>
                  </HeaderCheckbox>
                </div>
                <div className="price">Đơn giá</div>
                <div className="quantity">Số lượng</div>
                <div className="total">Thành tiền</div>
                <div className="action">
                  <DeleteOutlined
                    style={{ cursor: "pointer", fontSize: "18px" }}
                    onClick={handleRemoveMany}
                  />
                </div>
              </OrderHeader>

              <OrderItemList>
                {userOrderItems?.map((prod) => (
                  <OrderItem key={prod.product}>
                    <OrderItemInfo>
                      <Checkbox
                        value={prod.product}
                        onChange={onChange}
                        checked={listChecked.includes(prod.product)}
                      />
                      <OrderItemImg src={prod.image} alt="product" />
                      <OrderItemName>{prod.name}</OrderItemName>
                    </OrderItemInfo>
                    <OrderItemPrice>
                      <PriceCurrent>{convertPrice(prod.price)}</PriceCurrent>
                    </OrderItemPrice>
                    <OrderItemQuantity>
                      <InputNumber
                        min={1}
                        value={prod.amount}
                        onChange={(value) =>
                          onChangeAmount(value, prod.product)
                        }
                      />
                    </OrderItemQuantity>
                    <OrderItemTotal>
                      {convertPrice(prod.price * prod.amount)}
                    </OrderItemTotal>
                    <div style={{ width: "5%", textAlign: "right" }}>
                      <DeleteOutlined
                        style={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "16px",
                        }}
                        onClick={() => handleDeleteOrder(prod.product)}
                      />
                    </div>
                  </OrderItem>
                ))}
              </OrderItemList>
            </ColLeft>

            <ColRight>
              <OrderSummary>
                <SummaryInfo>
                  <SummaryLine className="address-line">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>Địa chỉ nhận hàng</span>
                      <span
                        onClick={() => setIsOpenModalUpdateInfo(true)}
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                      >
                        Thay đổi
                      </span>
                    </div>
                    <WrapperAddress>
                      {user.address}, {user.city}
                    </WrapperAddress>
                  </SummaryLine>
                  <SummaryLine>
                    <span>Tạm tính</span>
                    <span style={{ fontWeight: 500 }}>
                      {convertPrice(priceMeMo)}
                    </span>
                  </SummaryLine>
                  <SummaryLine>
                    <span>Phí giao hàng</span>
                    <span style={{ fontWeight: 500 }}>
                      {convertPrice(deliveryPriceMemo)}
                    </span>
                  </SummaryLine>
                </SummaryInfo>
                <SummaryTotalWrapper>
                  <TotalLabel>Tổng tiền</TotalLabel>
                  <TotalValue>
                    <TotalAmount>{convertPrice(totalPriceMemo)}</TotalAmount>
                    <TotalVAT>(Đã bao gồm VAT nếu có)</TotalVAT>
                  </TotalValue>
                </SummaryTotalWrapper>
                <BtnOrderSubmit onClick={handleAddCard}>
                  Mua hàng ({listChecked.length})
                </BtnOrderSubmit>
              </OrderSummary>
            </ColRight>
          </div>
        )}
      </OrderWrapper>

      <ModalComponent
        forceRender
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelModalInfo}
        onOk={handleConfirmUpdateInfo}
      >
        <Loading isLoading={isPending}>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <InputComponent
                value={stateUserDetail.name}
                onChange={handleOnchangeDetail}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="SĐT"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
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
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <InputComponent
                value={stateUserDetail.address}
                onChange={handleOnchangeDetail}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label="Tỉnh/TP"
              name="city"
              rules={[{ required: true, message: "Vui lòng nhập thành phố!" }]}
            >
              <InputComponent
                value={stateUserDetail.city}
                onChange={handleOnchangeDetail}
                name="city"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </OrderContainer>
  );
};

export default OrderPage;
