// Here we create the controllers
import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
// express formidable uses file system
// and we are using file system because we need to store the pictures of the product

// Payment gateway, we are using braintree
import braintree from "braintree";
import dotenv from "dotenv";
dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields; // this is because of express-formidable
    const { photo } = req.files; // again because of express-formidable

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case !photo || photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 1 MB" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Successfully added a new product",
      products,
    });
  } catch (error) {
    console.log("Error in create procuct controller", error);
    res.status(500).send({
      success: false,
      message: "Error in Create Product Controller",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields; // this is because of express-formidable
    const { photo } = req.files; // again because of express-formidable

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 1 MB" });
    }
    // const products = new productModel({...req.fields, slug : slugify(name)});
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Successfully updated the product",
      products,
    });
  } catch (error) {
    console.log("Error in update procuct controller", error);
    res.status(500).send({
      success: false,
      message: "Error in Update Product Controller",
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    if (!products) {
      res.status(500).send({
        success: false,
        message: "Not able to get products",
      });
    }
    res.status(200).send({
      totalCount: products.length,
      success: true,
      message: "All Products loaded successfully",
      products,
    });
  } catch (error) {
    console.log("Error in get product controller", error);
    res.status(500).send({
      success: false,
      message: "Error in product controller",
      error,
    });
  }
};

// Single product controller
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product loaded successfully",
      product,
    });
  } catch (error) {
    console.log("Error in get single product controller", error);
    res.status(500).send({
      success: false,
      message: "Error in get single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log("Error in product photo controller : ", error);
    res.status(500).send({
      success: false,
      message: "Error in product photo controller",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-phoot");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Error in delete product controller : ", error);
    res.status(500).send({
      success: true,
      message: "Error in delte product controller",
      error,
    });
  }
};

// Product filter controller
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Error in product filter controller : ", error);
    res.status(500).send({
      success: false,
      message: "Error in product filter controller",
    });
  }
};

// product count controller
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log("Error in productCountController : ", error);
    res.status(500).send({
      success: true,
      message: "Error in productCountController",
      error,
    });
  }
};

// Product per page productListController

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Error in productListController : ", error);
    res.status(500).send({
      success: false,
      message: "Error in productListController",
      error,
    });
  }
};

// Search Product Controller
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(result);
  } catch (error) {
    console.log("Error in searchProductcontroller : ", error);
    res.status(400).send({
      success: false,
      message: "Error in serchProductController",
      error,
    });
  }
};

// realted product controller
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Error in relatedProductController : ", error);
    res.status(500).send({
      success: false,
      message: "Error in related Product Controller",
      error,
    });
  }
};

// Product Category Controller

export const productCategoryController = async (req, res) => {
  try {
    // const {data} = await productModel.find({category : req.params.slug});
    // this won't work as slug is diff from the category name

    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log("Error in product Category Controller : ", error);
    res.status(500).send({
      success: false,
      error,
    });
  }
};

// BrainTreeProduct controller payment gateway
// token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log("Error in Braintree token controller : ", error);
    res.status(500).send({
      success: false,
      message: "Error in braintree controller",
      error,
    });
  }
};

// BrainTreePayments controller payment gateway
// payments
export const brainTreePaymentsController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((p) => {
      total += p.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, results) {
        if (results) {
          const order = orderModel({
            products: cart,
            payment: results,
            buyer: req.user._id,
          }).save();
          res.json({success: true, ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log("Error in Braintree token controller : ", error);
    res.status(500).send({
      success: false,
      message: "Error in braintree controller",
      error,
    });
  }
};
