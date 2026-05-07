import React, { useEffect, useMemo, useState } from "react";
import { Form, Radio } from "antd";

import {
  OrderContainer,
  OrderWrapper,
  OrderTitle,
  ColLeft,
  ColRight,
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
} from "./style";
import { useDispatch, useSelector } from "react-redux";

import {
  removeManyOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../untils"; // Điều chỉnh đường dẫn cho đúng với cấu trúc thư mục của Thắng
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoaddingComponent/Loadding";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { PayPalButtons } from "@paypal/react-paypal-js";
const PaymentPage = () => {
  const order = useSelector((state) => state.order);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later");
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [form] = Form.useForm();
  const navigtae = useNavigate();
  const [stateUserDetail, setStateUserDetail] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleOnchangeDetail = (e) => {
    setStateUserDetail({ ...stateUserDetail, [e.target.name]: e.target.value });
  };

  //MUTATION UPDATE
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    return UserService.updateUser(id, rests, token);
  });
  const { isPending, isSuccess, data } = mutationUpdate;
  //MUTATION ADD ORDER
  const mutaionAddOrder = useMutationHook((data) => {
    const { token, ...rests } = data;
    return OrderService.createOrder(rests, token);
  });
  const {
    isPending: isPendingAddOrder,
    isSuccess: isSuccessOrder,
    data: dataAddOrder,
  } = mutaionAddOrder;

  //Xử lý tổng tiền
  // Xử lý tổng tiền (Chỉ tính cho các sản phẩm được tích chọn)

  const priceMeMo = useMemo(() => {
    // Lấy đúng mảng mà Redux vừa trả về sau khi dispatch
    const result = order?.selectedItemOrders?.reduce((total, cur) => {
      return total + Number(cur.price) * Number(cur.amount);
    }, 0);

    return result || 0;
  }, [order?.selectedItemOrders]); // Chỉ cần theo dõi mảng này từ Store là đủ
  const deliveryPriceMemo = useMemo(() => {
    if (priceMeMo >= 2000000 || priceMeMo === 0) {
      return 0;
    } else {
      return 50000;
    }
  }, [priceMeMo]); // Phụ thuộc vào tổng tiền hàng
  const totalPriceMemo = useMemo(() => {
    return priceMeMo + deliveryPriceMemo;
  }, [priceMeMo, deliveryPriceMemo]); // Phụ thuộc vào tổng tiền hàng
  //xử lý tiền khi mua bằng paypel
  const totalInUSD = useMemo(() => {
    return (totalPriceMemo / 25000).toFixed(2); // Giả sử 1 USD = 25,000 VND
  }, [totalPriceMemo]);
  //xử lý mua hàng

  const handleCancelModalInfo = () => {
    setStateUserDetail({
      ...stateUserDetail,
      name: "",
      phone: "",
      address: "",
      city: "",
    });
    setIsOpenModalUpdateInfo(false);
  };
  const handleConfirmUpdateInfo = () => {
    form.submit(); // Kích hoạt validate của Ant Design
  };

  const onFinish = () => {
    const { name, address, city, phone } = stateUserDetail;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetail },
        {
          onSuccess: (data) => {
            // data.data là dữ liệu chuẩn từ server trả về sau khi update

            setIsOpenModalUpdateInfo(false);
          },
        },
      );
    }
  };
  //Xử lý chọn radio
  const handleDelivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };
  //Xử lý đặt hàng
  // Thêm tham số paymentDetails vào hàm
  const handleAddOrder = (paymentDetails = null) => {
    if (
      user?.access_token &&
      order?.selectedItemOrders &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMeMo &&
      user?.id
    ) {
      mutaionAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.selectedItemOrders,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMeMo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        shippingMethod: delivery,

        // --- THÊM 2 DÒNG NÀY ĐỂ SERVER LƯU TRẠNG THÁI ---
        isPaid: payment === "paypal" ? true : false,
        paidAt: paymentDetails ? paymentDetails.update_time : null,
        // ----------------------------------------------
      });
    } else {
      message.error("Vui lòng cập nhật đầy đủ thông tin giao hàng!");
    }
  };
  useEffect(() => {
    if (isOpenModalUpdateInfo && user) {
      const userData = {
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
      };
      setStateUserDetail(userData);
      form.setFieldsValue(userData); // Set trực tiếp ở đây luôn cho chắc
    }
  }, [isOpenModalUpdateInfo, user, form]);
  useEffect(() => {
    form.setFieldsValue(stateUserDetail);
  }, [form, stateUserDetail]);
  //Đặt hàng thành công
  useEffect(() => {
    if (isSuccessOrder && dataAddOrder?.status === "OK") {
      const arrayOrdered = order?.selectedItemOrders?.map(
        (item) => item.product,
      );
      dispatch(removeManyOrderProduct({ listChecked: arrayOrdered }));
      dispatch(selectedOrder({ listChecked: [] }));
      message.success("Đặt hàng thành công");
      // Điều hướng hoặc xóa giỏ hàng ở đây
      navigtae("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.selectedItemOrders,
        },
      });
    } else if (isSuccessOrder && dataAddOrder?.status === "ERR") {
      message.error(dataAddOrder?.message || "Có lỗi xảy ra");
    }
  }, [
    isSuccessOrder,
    dataAddOrder,
    delivery,
    payment,
    dispatch,
    navigtae,
    order?.selectedItemOrders,
  ]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      dispatch(
        updateUser({
          ...data?.data,
          access_token: user?.access_token, // Giữ lại token để không bị Loading/Log out
        }),
      );
      message.success("Cập nhật thành công");
      // Điều hướng hoặc xóa giỏ hàng ở đây
      // navigate('/order-success');
    } else if (isSuccess && data?.status === "ERR") {
      message.error(data?.message || "Có lỗi xảy ra");
    }
  }, [isSuccess, data, dispatch, user?.access_token]);
  return (
    <OrderContainer>
      <Loading isLoading={isPendingAddOrder}>
        <OrderWrapper>
          <OrderTitle>PHƯƠNG THỨC THANH TOÁN</OrderTitle>
          <div style={{ display: "flex", gap: "16px" }}>
            <ColLeft>
              {/* Phần chọn phương thức giao hàng */}
              <div
                style={{
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "4px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "12px" }}>
                  Chọn phương thức giao hàng
                </div>
                <div
                  style={{
                    background: "#f0f8ff",
                    padding: "12px",
                    borderRadius: "4px",
                    border: "1px solid #add8e6",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Radio.Group onChange={handleDelivery} value={delivery}>
                    <Radio value="fast">
                      <span
                        style={{
                          color: "#ea8500",
                          fontWeight: "bold",
                          marginRight: "4px",
                        }}
                      >
                        FAST
                      </span>
                      Giao hàng tiết kiệm
                    </Radio>
                    <br />
                    <Radio value="gojek" style={{ marginTop: "8px" }}>
                      <span
                        style={{
                          color: "#ea8500",
                          fontWeight: "bold",
                          marginRight: "4px",
                        }}
                      >
                        GO_JEK
                      </span>
                      Giao hàng tiết kiệm
                    </Radio>
                  </Radio.Group>
                </div>
              </div>

              {/* Phần chọn phương thức thanh toán */}
              <div
                style={{
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "12px" }}>
                  Chọn phương thức thanh toán
                </div>
                <div
                  style={{
                    background: "#f0f8ff",
                    padding: "12px",
                    borderRadius: "4px",
                    border: "1px solid #add8e6",
                  }}
                >
                  <Radio.Group onChange={handlePayment} value={payment}>
                    <div>
                      <Radio value="later">
                        Thanh toán tiền mặt khi nhận hàng
                      </Radio>
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <Radio value="paypal">Thanh toán bằng Paypal</Radio>
                    </div>
                  </Radio.Group>
                </div>
              </div>
            </ColLeft>

            <ColRight>
              <OrderSummary>
                <SummaryInfo>
                  <SummaryLine>
                    <WrapperAddress>
                      Địa chỉ : {user.address}, {user.city}
                    </WrapperAddress>
                    <span
                      onClick={() => setIsOpenModalUpdateInfo(true)}
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        fontSize: "13px",
                        whiteSpace: "nowrap", // Giữ chữ "Thay đổi" không bị ngắt đôi
                      }}
                    >
                      Thay đổi
                    </span>
                  </SummaryLine>
                  <SummaryLine>
                    <span>Tạm tính</span>
                    <span>{convertPrice(priceMeMo)}</span>
                  </SummaryLine>
                  <SummaryLine>
                    <span>Phí giao hàng</span>
                    <span>{convertPrice(deliveryPriceMemo)}</span>
                  </SummaryLine>
                </SummaryInfo>
                <SummaryTotalWrapper>
                  <TotalLabel>Tổng tiền</TotalLabel>
                  <TotalValue>
                    <TotalAmount>{convertPrice(totalPriceMemo)}</TotalAmount>
                    <TotalVAT>(Đã bao gồm VAT nếu có)</TotalVAT>
                  </TotalValue>
                </SummaryTotalWrapper>
                {payment === "paypal" ? (
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    forceReRender={[totalInUSD]} // 🔥 THÊM DÒNG NÀY
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: totalInUSD,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data) => {
                      try {
                        const res = await fetch(
                          `${process.env.REACT_APP_API_URL_BACKEND}/order/capture-paypal`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              token: `Bearer ${user?.access_token}`,
                            },
                            body: JSON.stringify({
                              orderID: data.orderID,
                            }),
                          },
                        );

                        const details = await res.json();

                        handleAddOrder(details);
                        message.success("Thanh toán PayPal thành công!");
                      } catch (err) {
                        console.log(err);
                        message.error("Lỗi capture PayPal");
                      }
                    }}
                    onError={(err) => {
                      message.error("Lỗi thanh toán PayPal");
                    }}
                  />
                ) : (
                  <BtnOrderSubmit onClick={handleAddOrder}>
                    Đặt hàng
                  </BtnOrderSubmit>
                )}
              </OrderSummary>
            </ColRight>
          </div>
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
              // footer:null
            >
              <Form.Item
                label="Name"
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
                label="Phone"
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
                label="Address"
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
                label="City"
                name="city"
                rules={[
                  { required: true, message: "Vui lòng nhập thành phố!" },
                ]}
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
      </Loading>
    </OrderContainer>
  );
};

export default PaymentPage;
