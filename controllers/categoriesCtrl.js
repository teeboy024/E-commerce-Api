import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
//@desc Create new Category
//@route POST /api/v1/categories
//@access private/Admin

export const createCategoryCtrl = asyncHandler(async (req,res) =>{
    const {name} = req.body
    //category exists
    const categoryFound = await Category.findOne({name});
    if(categoryFound){
        throw new Error("Category already exists")
    }
    //create 
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image:req.file.path
    });
    res.json({
        status:"success",
        message:"Category created successfully",
        category,
    })
})

//@desc Get all Category
//@route POST /api/v1/categories
//@access public

export const getAllCategoryCtrl = asyncHandler(async (req,res) =>{
    const categories = await Category.find()
    res.json({
        status:"success",
        message:"Category fetched successfully",
        categories,
    })
});

//@desc Get single Category
//@route Get /api/v1/categories/:id
//@access public

export const getSingleCategoryCtrl = asyncHandler(async (req,res) =>{
    const category = await Category.findById(req.params.id)
    res.json({
        status:"success",
        message:"Category fetched successfully",
        category,
    })
});


//@desc Get update Category
//@routes put /api/v1/categories/:id/update
//access private/Admin

export const updateCategoryCtrl = asyncHandler (async(req, res)=>{
    const{ name } = req.body

    //update
    const category = await Category.findByIdAndUpdate(req.params.id,
    {
        name, 
       
    },
    {
        new: true,
    }
    )
    res.json({
        status: "success",
        message: "Category updated successfully",
        category,
    });
});

//@desc delete category
//@routes delete/api/v1/category/:id/delete
//access private/Admin

export const deleteCategoryCtrl = asyncHandler (async(req, res)=>{
    await Category.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "category deleted successfully",
    });
});



