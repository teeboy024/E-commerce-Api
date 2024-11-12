import express from "express";
import { CreateOrderCtrl, getAllOrdersCtrl, GetOrderStatsCtrl,  getSingleOrderCtrl, updateOrderCtrl } from "../controllers/orderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRouter = express.Router();

orderRouter.post('/',isLoggedIn,CreateOrderCtrl)
orderRouter.get('/',getAllOrdersCtrl)
orderRouter.get('/sales/sum', isLoggedIn ,GetOrderStatsCtrl)
orderRouter.get('/:id', isLoggedIn ,getSingleOrderCtrl)
orderRouter.put('/update/:id', isLoggedIn ,updateOrderCtrl)


export default orderRouter