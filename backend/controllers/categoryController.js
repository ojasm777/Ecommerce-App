// this is the step after which we can check postman
// we will create the controller with try catch block
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                message : "Name is required"
            })
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success : true,
                message : "Category already exists"
            })
        }
        const category = await new categoryModel({name, slug : slugify(name)}).save();
        return res.status(201).send({
            success : true,
            message : "New category created",
            category
        })
    } catch (e) {
        console.log("Error in categoryController", e);
        res.status(500).send({
            success : false,
            e,
            message : "Error in categoryController"
        })
    }
}


// Update Category Controller
export const updateCategoryController = async (req, res) => {
    try {
        // If I need to update a category I first need the original category
        // and then I need the updated values
        const {name} = req.body;
        // req.params => urls me se milegi
        const {id} = req.params;
        // if we don't do new : true while updating it won't update
        const category = await categoryModel.findByIdAndUpdate(id,{name, slug : slugify(name)}, {new : true});
        res.status(200).send({
            success : true,
            message : "Category updated successfully",
            category
        })
    } catch(error) {
        console.log("Error in update category controller", error);
        res.status(500).send({
            success : false,
            message : "Error in updating category",
            error
        })
    }
}

// Get all category controller
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        if(!category){
            res.status(500).send({
                success : false,
                message : "Not able to get category from database in category controller"
            })
        }
        else {
            res.status(200).send({
                success : true,
                message : "All category list",
                category
            })
        }
    } catch (error) {
        console.log("Error in category Controller : ", error);
        res.status(500).send({
            success : false,
            message : "Error in category controller",
            error
        })
    }
}

// Single category controller
export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({slug : req.params.slug}); // slug in params
        res.status(200).send({
            success : true,
            message : "Get single category successfully",
            category
        })
    } catch (error) {
        console.log("Error in single category controller : ", error);
        res.status(500).send({
            success : false,
            message : "Error in single category controller",
            error
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const {id} = req.params;
        // Here I did an error instead of findByIdAndDelete I did findOneAndDelete, but got it right 
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success : true,
            message : "Category deleted successfully",
        })
    } catch (error) {
        console.log("Error in delete category controller : ", error);
        res.status(500).send({
            success : false,
            message : "Error in delete category controller",
            error
        })
    }
}