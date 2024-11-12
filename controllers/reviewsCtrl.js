import Review from "../model/Review.js";
import asyncHandler from "express-async-handler";
import Product from "../model/product.js";
//@desc Create new review
//@route Post /api/v1/reviews
//@acess Private/Admin

export const createReviewCtrl = asyncHandler(async(req,res) => {
    const {product , message , rating} = req.body
    //1. find the product
    const {productID} = req.params;
    const productFound = await Product.findById(productID).populate('reviews')
    if(!productFound){
        throw new Error('product not found')
    }
    // check if user already review this product
    const hasReviewed = productFound?.reviews?.find((review) =>{
        console.log(review)
        return review?.user?.toString() === req?.userAuthId.toString()
    })
    if(hasReviewed){
        throw new Error ("You have already reviewed this product")
    }
    //create review
    const review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user: req.userAuthId
    });
    //push review into product found 
    productFound.reviews.push(review?._id)
    //resave
    await productFound.save();
    res.status(201).json({
        success: true,
        message: "Review created successfully",
    }); 
});