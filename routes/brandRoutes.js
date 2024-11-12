import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandsCtrl, getSingleBrandCtrl, updateBrandsCtrl } from "../controllers/brandCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const brandsRouter = express.Router();

brandsRouter .post('/',isLoggedIn,isAdmin,createBrandCtrl)
brandsRouter .get('/',getAllBrandsCtrl)
brandsRouter .get('/:id',getSingleBrandCtrl)
brandsRouter .put('/:id',isLoggedIn,isAdmin,updateBrandsCtrl)
brandsRouter .delete('/:id',isLoggedIn,isAdmin,deleteBrandCtrl)


export default brandsRouter