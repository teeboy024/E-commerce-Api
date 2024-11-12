import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoryCtrl, getSingleCategoryCtrl, updateCategoryCtrl } from "../controllers/categoriesCtrl.js";
import categoryFileUpload from "../config/categoryUpload.js";

const categoriesRouter = express.Router();

categoriesRouter.post('/',isLoggedIn,categoryFileUpload.single("file"),createCategoryCtrl)
categoriesRouter.get('/',getAllCategoryCtrl)
categoriesRouter.get('/:id',getSingleCategoryCtrl)
categoriesRouter.put('/:id',isLoggedIn,updateCategoryCtrl)
categoriesRouter.delete('/:id',isLoggedIn,deleteCategoryCtrl)


export default categoriesRouter