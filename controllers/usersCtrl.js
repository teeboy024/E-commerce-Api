import User from "../model/User.js"
import bcrypt from "bcryptjs"
import asyncHandler from 
"express-async-handler"
import generateToken from "../utils/generatetoken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifytoken } from "../utils/verifyToken.js";
generateToken
// @desc register user 
// routes POST /api/v1/users/register
// acess Private/Admin

export const registerUserCtrl = asyncHandler(async(req,res)=>{
    const {fullname,email,password} = req.body 
    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        //throw
        throw new Error("user already exist");
    }
    //hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password,salt)
    // create the user 
    const user = await User.create({
        fullname,
        email,
        password: hashedpassword,
    });
    res.status(201).json({
        status:'success',
        message:'User Registered successfully',
        data: user,
    })
});
// @desc login user 
// routes POST /api/v1/users/login
// acess Public

export const  loginUserCrtl = asyncHandler(async (req,res) => {
    const {email, password } = req.body;
    //find the user in db by email only 
    const userfound =  await User.findOne({email});
    if(userfound && await bcrypt.compare(password,userfound?.password)){
        res.json({
            status:"success",
            message:"User logged in successfully",
            userfound,
            token:generateToken(userfound?._id)
        })
    }else{
        throw new Error("invalid login credentials");
    }
})

// @desc Get user profile 
// routes GET /api/v1/users/profile
// acess Private
export const getUserProfileCtrl = asyncHandler(async(req,res) => {
   //find the user 
   const user = await User.findById(req.userAuthId).populate('orders')
   res.json({
    status : 'success',
    message : 'user profile fetched successfully',
    user,
   })
});


//@desc Update user shipping address
//@route PUT /api/v1/user/update/shipping
//@access private
export const updateShippingAddressCtrl = asyncHandler(async(req,res) => {
    const {firstName,lastName,address,city,postalCode,state,phone} = req.body
    const user = await User.findByIdAndUpdate(req.userAuthId,{
        shippingAdress:{
            firstName,
            lastName,
            address,
            city,
            postalCode,
            state,
            phone,
        },
        hasShipppingAddress: true,
    },
    {
        new:true,
    }
  );
  res.json({
    status:'success',
    message:'User shipping address updated successfully',
    data: user,
  });
});