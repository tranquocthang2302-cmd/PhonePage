const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone, address } = newUser;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "The email is already",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        confirmPassword,
        phone,
        address,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "Tên đăng nhập không tồn tại",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "Sai mật khẩu",
        });
      }
      const access_token = await generalAccessToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await generalRefreshToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
      // const comparePassword = bcrypt.compareSync(password, checkUser.password);
      // if (!comparePassword) {
      //   resolve({
      //     status: "OK",
      //     message: "The password or user is incorrect",
      //   });
      // }
      // const access_token = await generalAccessToken({
      //   id: checkUser._id,
      //   isAdmin: checkUser.isAdmin,
      // });
      // const refresh_token = await generalRefreshToken({
      //   id: checkUser._id,
      //   isAdmin: checkUser.isAdmin,
      // });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await User.findByIdAndDelete(id);
      // const comparePassword = bcrypt.compareSync(password, checkUser.password);
      // if (!comparePassword) {
      //   resolve({
      //     status: "OK",
      //     message: "The password or user is incorrect",
      //   });
      // }
      // const access_token = await generalAccessToken({
      //   id: checkUser._id,
      //   isAdmin: checkUser.isAdmin,
      // });
      // const refresh_token = await generalRefreshToken({
      //   id: checkUser._id,
      //   isAdmin: checkUser.isAdmin,
      // });
      resolve({
        status: "OK",
        message: "Delete USER SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteMany = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: { $in: ids } });
      // const comparePassword = bcrypt.compareSync(password, checkUser.password);
      // if (!comparePassword) {
      //   resolve({
      //     status: "OK",
      //     message: "The password or user is incorrect",
      //   });
      // }
      // const access_token = await generalAccessToken({
      //   id: checkUser._id,
      //   isAdmin: checkUser.isAdmin,
      // });
      // const refresh_token = await generalRefreshToken({
      //   id: checkUser._id,
      //   isAdmin: checkUser.isAdmin,
      // });
      resolve({
        status: "OK",
        message: "Delete USER SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "DETAILS SUCCESS",
        data: checkUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteMany,
};
