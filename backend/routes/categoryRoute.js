// This is used to create Routes and we export routes
// This is the second step we use middle wares and create routes
// The third step is to create controller
import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();
// slash is important
// Create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// update category
// id is in params => yaani urls me deni hogi id
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// getAll category
// no middleware needed
router.get('/get-category', categoryController);

// Get single category
// slug is needed and it will be in params ig
// why not id? because in url slug would be better than id
router.get('/single-category/:slug', singleCategoryController);

// delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

export default router;
