import asyncHandler from "express-async-handler";
import Color from "../model/color.js";
//@desc Create new color
//@route POST /api/v1/color
//@access private/Admin

export const createColorCtrl = asyncHandler(async (req,res) =>{
    const {name} = req.body
    //cate exists
    const colorFound = await Color.findOne({name});
    if(colorFound){
        throw new Error("color already exists")
    }
    //create 
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.json({
        status:"success",
        message:"color created successfully",
        color,
    })
})

//@desc Get all color
//@route POST /api/v1/color
//@access public

export const getAllColorsCtrl = asyncHandler(async (req,res) =>{
    const colors = await Color.find()
    res.json({
        status:"success",
        message:"colors fetched successfully",
        colors,
    })
});

//@desc Get single colors
//@route Get /api/v1/color/:id
//@access public

export const getSingleColorCtrl = asyncHandler(async (req,res) =>{
    const color = await Color.findById(req.params.id)
    res.json({
        status:"success",
        message:"color fetched successfully",
        color,
    })
});


//@desc Get update color
//@routes put /api/v1/color/:id/update
//access private/Admin

export const updateColorCtrl = asyncHandler (async(req, res)=>{
    const{ name } = req.body

    //update
    const color = await Color.findByIdAndUpdate(req.params.id,
    {
        name, 
       
    },
    {
        new: true,
    }
    )
    res.json({
        status: "success",
        message: "color updated successfully",
        color,
    });
});

//@desc delete color
//@routes delete/api/v1/color/:id/delete
//access private/Admin

export const deleteColorCtrl = asyncHandler (async(req, res)=>{
    await Color.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "color deleted successfully",
    });
});



