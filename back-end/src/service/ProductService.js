const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description } =
      newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERROR",
          message: "The name of product is already exists",
        });
      }
      const createdProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
      });
      if (createdProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdProduct,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
const updateProduct = (productId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: productId,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      if (data.price !== undefined || data.discount !== undefined) {
        const finalPrice =
          data.price !== undefined ? data.price : checkProduct.price;
        const finalDiscount =
          data.discount !== undefined ? data.discount : checkProduct.discount;

        // Tính toán lại newPrice dựa trên bộ số cuối cùng
        data.newPrice = finalPrice - finalPrice * ((finalDiscount || 0) / 100);
      }
      const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "DETAILS SUCCESS",
        data: checkProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await Product.findByIdAndDelete(id);

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
      await Product.deleteMany({ _id: { $in: ids } });

      resolve({
        status: "OK",
        message: "Delete MANY SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Khởi tạo các giá trị mặc định
      let query = {};
      let objectSort = {};

      // 2. Xử lý Filter (nếu có)
      if (filter) {
        const key = filter[0];
        const value = filter[1];
        query[key] = { $regex: value, $options: "i" };
      }

      // 3. Xử lý Sort (nếu có, không thì mặc định theo name)
      if (sort && sort.length === 2) {
        objectSort[sort[1]] = sort[0];
      } else {
        objectSort.name = "asc"; // Mặc định sắp xếp theo tên
      }

      // 4. Đếm tổng số sản phẩm dựa trên query (để phân trang đúng)
      const totalProduct = await Product.countDocuments(query);

      // 5. Thực thi truy vấn MỘT LẦN DUY NHẤT
      const allProduct = await Product.find(query)
        .limit(limit)
        .skip(page * limit)
        .sort(objectSort);

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allProduct,
        total: totalProduct,
        currentPage: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllTypeProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const AllType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: AllType,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteMany,
  getAllTypeProduct,
};
