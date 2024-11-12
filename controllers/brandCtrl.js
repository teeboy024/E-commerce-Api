import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
//@desc Create new brand
//@route POST /api/v1/brand
//@access private/Admin

export const createBrandCtrl = asyncHandler(async (req,res) =>{
    const {name} = req.body
    //cate exists
    const BrandFound = await Brand.findOne({name});
    if(BrandFound){
        throw new Error("Brand already exists")
    }
    //create 
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.json({
        status:"success",
        message:"Brand created successfully",
        brand,
    })
})

//@desc Get all brand
//@route POST /api/v1/brand
//@access public

export const getAllBrandsCtrl = asyncHandler(async (req,res) =>{
    const brands = await Brand.find()
    res.json({
        status:"success",
        message:"Brands fetched successfully",
        brands,
    })
});

//@desc Get single brands
//@route Get /api/v1/breans/:id
//@access public

export const getSingleBrandCtrl = asyncHandler(async (req,res) =>{
    const brand = await Brand.findById(req.params.id)
    res.json({
        status:"success",
        message:"Brand fetched successfully",
        brand,
    })
});


//@desc Get update brand
//@routes put /api/v1/brand/:id/update
//access private/Admin

export const updateBrandsCtrl = asyncHandler (async(req, res)=>{
    const{ name } = req.body

    //update
    const brand = await Brand.findByIdAndUpdate(req.params.id,
    {
        name, 
       
    },
    {
        new: true,
    }
    )
    res.json({
        status: "success",
        message: "Brand updated successfully",
        brand,
    });
});

//@desc delete Brand
//@routes delete/api/v1/brand/:id/delete
//access private/Admin

export const deleteBrandCtrl = asyncHandler (async(req, res)=>{
    await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Brand deleted successfully",
    });
});



