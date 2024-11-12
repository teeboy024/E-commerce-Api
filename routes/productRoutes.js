import express from "express";
import { createProductsCtrl, deleteProductCtrl,  getAllProductsCtrl,  getSingleProductCtrl, updateProductCtrl,  } from "../controllers/productCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";
const productsRouter = express.Router()


productsRouter.post("/",isLoggedIn,isAdmin,upload.array("files"),createProductsCtrl)
productsRouter.get("/",getAllProductsCtrl)
productsRouter.get("/:id",getSingleProductCtrl)
productsRouter.put("/:id",isLoggedIn,isAdmin,updateProductCtrl)
productsRouter.delete("/:id",isLoggedIn,isAdmin,deleteProductCtrl)



export default productsRouter
