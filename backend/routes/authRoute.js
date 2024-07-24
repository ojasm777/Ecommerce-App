import express from "express";
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
// we need to create all the routes here
// If we create separate file for router then we need router object

const router = express.Router();

// routing
// REGISTER || METHOD POST
router.post('/register', registerController);

// LOGIN || METHOD POST
router.post('/login', loginController);

// forgot password || METHOD POST
router.post('/forgot-password', forgotPasswordController);
// test route
router.get('/test',requireSignIn,isAdmin, testController); // If only the JWT token in our header is valid (requiresignin) only then we will be logged in

// Protected user route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok : true});
})

// Protected Admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok : true});
});

// Profile update
router.put('/profile', requireSignIn, updateProfileController);

// orders
router.get('/orders', requireSignIn, getOrdersController);

// orders
router.get('/all-orders', requireSignIn,isAdmin, getAllOrdersController);

// order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

export default router;