import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  access_token: "",
  id: "",
  isAdmin: false,
  city: "",
};

export const userSilde = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name,
        email,
        access_token,
        address,
        avatar,
        phone,
        _id,
        isAdmin,
        city,
      } = action.payload;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.id = _id;
      state.access_token = access_token || state.access_token; // <--- CỨU CÁNH Ở ĐÂY
      state.isAdmin = isAdmin;
      state.city = city;
    },
    refreshUser: (state) => {
      state.name = "";
      state.email = "";
      state.phone = "";
      state.address = "";
      state.avatar = "";
      state.access_token = "";
      state.isAdmin = false;
      state.id = ""; // QUAN TRỌNG: Phải reset ID về rỗng
      state.city = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, refreshUser } = userSilde.actions;

export default userSilde.reducer;
