// second step after creating schema and the model
import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { brainTreePaymentsController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// routes
// create product route
router.post('/create-product', requireSignIn,isAdmin, formidable(), createProductController);

// create product route
router.put('/update-product/:pid', requireSignIn,isAdmin, formidable(), updateProductController);

// get product route
router.get('/get-product', getProductController);

// get single product
router.get('/get-product/:slug', getSingleProductController);

// get route for photo
router.get('/product-photo/:pid', productPhotoController);

// delete product
router.delete('/delete-product/:pid', deleteProductController);

// product filter
router.post('/product-filter/', productFilterController);

// product count
router.get('/product-count', productCountController);

// product per page
router.get('/product-list/:page', productListController);

// search router
router.get('/search/:keyword', searchProductController);

// similar products
router.get('/related-product/:pid/:cid', relatedProductController);

// category wise products
router.get('/product-category/:slug', productCategoryController);

// payments route
// token
router.get('/braintree/token', braintreeTokenController);

// payments
router.post('/braintree/payments', requireSignIn, brainTreePaymentsController);
export default router;