import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorCtrl, deleteColorCtrl, getAllColorsCtrl, getSingleColorCtrl, updateColorCtrl } from "../controllers/colorCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorRouter = express.Router();

colorRouter .post('/',isLoggedIn,isAdmin,createColorCtrl)
colorRouter .get('/',getAllColorsCtrl)
colorRouter .get('/:id',getSingleColorCtrl)
colorRouter .put('/:id',isLoggedIn,isAdmin,updateColorCtrl)
colorRouter .delete('/:id',isLoggedIn,isAdmin,deleteColorCtrl)


export default colorRouter