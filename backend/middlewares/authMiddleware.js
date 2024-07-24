import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
// Middleware function to protect the route
// this is done to protect a route
// Protected routes token base

// for the user
export const requireSignIn = async (req, res, next) => {
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode; // this is required to save the user data to req.user (We get the id)
        next();
    } catch (error) {
        console.log("Token Error : ", error);
    }

}

// for the admin
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){
            return res.status(401).send({
                success : false,
                message : "unauthorized access"
            })
        } else {
            next();
        }
    } catch (error) {
        console.log("MiddleWare isAdmin Error : ", error);
        res.status(401).send({
            success : false,
            message : "Error in admin Middleware",
            error
        })
    }
}