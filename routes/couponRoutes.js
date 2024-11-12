import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCouponCtrl, deleteCouponCtrl, getAllCouponssCtrl, getSingleCouponCtrl, updateCouponCtrl } from "../controllers/couponsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponRouter = express.Router();

couponRouter.post('/',isLoggedIn,isAdmin,createCouponCtrl)
couponRouter.get('/',getAllCouponssCtrl)
couponRouter.get('/:id',getSingleCouponCtrl)
couponRouter.put('/:id',isLoggedIn, isAdmin,updateCouponCtrl)
couponRouter.delete('/:id',isLoggedIn,isAdmin,deleteCouponCtrl)

export default couponRouter 