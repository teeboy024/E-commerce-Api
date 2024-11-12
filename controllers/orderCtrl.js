import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv"
dotenv.config();
import Order from "../model/Order.js";
import User from "../model/User.js"
import Product from "../model/product.js"
import { configDotenv } from "dotenv";
import Coupon from "../model/Coupon.js";

//@desc create orders
//@routes POST /api/v1/orders
//@access privatev


//stipe instance
const stripe = new Stripe(process.env.STRIPE_KEY)
export const CreateOrderCtrl = asyncHandler(async (req,res) => {
    //get the coupon
    const { coupon } = req?.query
    const couponFound = await Coupon.findOne({
        code: coupon?.toUpperCase(),
    });
    if(couponFound?.isExpired){
        throw new Error('coupon has expired')
    }
    if(!couponFound){
        throw new Error('Coupon does exist');
    }

    //get discount
    const discount = couponFound?.discount /100
    //find the payload(customer, orderItems,shippingAddress, totalPrice);
    const { orderItems, shippingAddress, totalPrice} = req.body;
    //find the user
    const user = await User.findById(req.userAuthId);
    if(!user?.shippingAdress){
        throw new Error ("please provide shipping address");
    }
    //check if order is not empty 
    if(orderItems?.length <= 0 ){
        throw new Error ("No Order Items");
    }
    //place/create order - saveinto database
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice : couponFound ? totalPrice - totalPrice * discount : totalPrice
    }); 
    console.log(order)
    //update the product qty
    const products = await Product.find({_id:{$in:orderItems}})
    orderItems?.map (async(order) => {
        const product = products?.find((product) => {
            return product?._id?.toString() === order?._id?.toString();
        })
        if(product){
            product.totalSold += order.qty
        }
        await product.save();
    })
    //push order into user 
    user.orders.push(order?._id);
    await user.save();
    //make payment (stripe)
    //convert order item to have same strucutre that stripe need 
    const convertOrders = orderItems.map((item) => {
       return{
          price_data:{
            currency: "usd",
            product_data :{
                name : item?.name,
                description: item?.description,
            },
            unit_amount:item?.price * 100,
        },
        quantity: item?.qty,
    }
    })
    const session = await stripe.checkout.sessions.create({
        line_items: convertOrders,
        metadata :{
            orderId : JSON.stringify(order?._id)
        },
        mode : 'payment',
        success_url:'http://localhost:7000/success',
        cancel_url:'http://localhost:7000/cancel',
    })
    res.send({url: session.url});
    
});

export const getAllOrdersCtrl = asyncHandler(async (req,res) =>{
    const order = await Order.find()
    res.json({
        status:"success",
        message:"orders fetched successfully",
        order,
    })
});

//@desc Get single order
//@routes Get /api/v1/order/:id
//access private/admin

export const getSingleOrderCtrl =asyncHandler(async(req,res) => {
    //get the id from params 
    const id = req.params.id;
    const order = await Order.findById(id);
    //send response
    res.status(200).json({
        success: true,
        message: "single order",
        order,
    });
})

//@desc update order to be delivired
//@routes Get /api/v1/order/update/:id
//access private/admin

export const updateOrderCtrl = asyncHandler(async (req,res) => {
    //get the id from the params 
    const id = req.params.id;
    //update
    const updateOrder = await Order.findByIdAndUpdate(
        id,
        {
          status: req.body.status,
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        success: true,
        message: "order delivered",
        updateOrder
    })
})

//@desc get sales sum of orders
//@route get /api/v1/orders/sales/sum
//acess private/admin
export const GetOrderStatsCtrl = asyncHandler(async(req,res) => {
    //get orders stats
    const Orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                minimumSales: {
                    $min: "$totalPrice",
                },
                totalSales:{
                    $sum: "$totalPrice"
                },
                maximumSales:{
                    $max: "$totalPrice"
                },
                averageSales:{
                    $max: "$totalPrice"
                },
            },
        },
    ]);
    //get the date
    const date = new Date()
    const today = new Date(date.getFullYear(), date.getMonth(),date.getDate());
    const saleToday = await Order.aggregate([
        {
            $match:{
                createdAt:{
                    $gte: today,
                },
            }
        },
        {
            $group:{
                _id: null,
                totalSales:{
                    $sum: "$totalPrice",
                },
            },
        },
    ]);
    //send response 
    res.status(200).json({
        success:true,
        message: "Sum of orders",
        Orders,
        saleToday
    });
});