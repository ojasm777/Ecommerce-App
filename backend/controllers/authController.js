// To register an user
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

// login
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, answer, address } = req.body; // req.body contains all the user info
    // validation
    if (!name) return res.send({ messaage: "Name is required" });
    if (!email) return res.send({ messaage: "email is required" });
    if (!password) return res.send({ messaage: "password is required" });
    if (!answer) return res.send({ messaage: "answer is required" });
    if (!phone) return res.send({ messaage: "phone is required" });
    if (!address) return res.send({ messaage: "address is required" });

    // check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password);
    // save user
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error in registerController : ", error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // token
    // this is the token that keep us logged in for 7 days
    // and it is in req.headers.authorization (used in requiresignin) if same
    // only then logged in
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("Login Error : ", error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const testController = (req, res) => {
  // console.log("protected route");
  res.send("Protected Route");
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.send(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.send(400).send({
        message: "answer is required",
      });
    }
    if (!newPassword) {
      res.send(400).send({
        message: "newPassword is required",
      });
    }
    // check email and answer
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or password",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findById(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log("Error occured in forgotPassword controller", err);
    res.status(500).send({
      success: false,
      message: err,
    });
  }
};

// Update Profile Controller
//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Update profile",
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log("Error in getting order controller : ", error);
    res.status(500).send({
      success: false,
      error,
    });
  }
};


// Get all orders controller
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
    .find({})
    .populate("products", "-photo")
    .populate("buyer", "name")
    .sort({createdAt : -1})
    res.json(orders);
  } catch (error) {
    console.log("Error in getting all orders controller : ", error);
    res.status(500).send({
      success : false,
      message : "Error in getting all orders controller ",
      error
    })
  }
};

// order status controller
export const orderStatusController = async (req, res) => {
  try {
    const {orderId} = req.params;
    const {status} = req.body;
    const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new : true});
    res.json(orders);
  } catch (error) {
    console.log("Error in order status controller : ", error);
    res.status(500).send({
      success : false,
      message : "Error in order status controller",
      error
    })
  }
}