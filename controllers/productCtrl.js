import asyncHandler from "express-async-handler";
import Product from "../model/product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

//@desc Create new product
//@routes Post /api/v1/products
//access private/admin
export const createProductsCtrl = asyncHandler (async (req, res) => {
    const convertedImgs = req.files.map((file) => file.path)
    console.log(convertedImgs)
    const { name, description, category,sizes, colors, price, totalQty,brand} = req.body;
    //products exists
    const productExixts = await Product.findOne({ name })
    if (productExixts){
        throw new Error("products Already Exists")
    }

     //find the brand
     const brandFound = await Brand.findOne ({
         name:brand.toLowerCase(),
     })
     if(!brandFound){
         throw new Error (
             "Brand not found,please create brand first or check brand name"
         )
     }

    //find the category
    const categoryFound = await Category.findOne ({
        name:category
    })
    if(!categoryFound){
        throw new Error (
            "category not found,please create category first or check category name"
        )
    }
    //create the products
    const product = await Product.create({
        name, 
        description, 
        category,
        sizes,
        colors, 
        user: req.userAuthId, 
        price, 
        totalQty,
        brand,
        images: convertedImgs
    });
    //push the product into category
    categoryFound.product.push(product._id)
    //resave
    await categoryFound.save()
    //send the respone
    

    //push the product into brand
    brandFound.products.push(product._id)
    //resave
    await brandFound.save()
    //send the respone
    res.json({
        status:"success",
        message:"product created successfully",
        product,
    })
});

//@desc Get all product
//@routes Get /api//v1products
//access public

export const getAllProductsCtrl = asyncHandler(async(req,res) => {
    // console.log(req.query)
    //query
    let productQuery = Product.find();

    //filter by name
    if(req.query.name){
        productQuery = productQuery.find({
            name:{$regex: req.query.name, $options: "i"}
        })
    }
    //filter by brand
    if(req.query.brand){
        productQuery = productQuery.find({
            brand:{$regex: req.query.brand, $options: "i"}
        })
    }
    //filter by category
    if(req.query.category){
        productQuery = productQuery.find({
            category:{$regex: req.query.category, $options: "i"}
        })
    }
     //filter by color
     if(req.query.colors){
        productQuery = productQuery.find({
            colors:{$regex: req.query.colors, $options: "i"}
        })
    }
     //filter by size
     if(req.query.sizes){
        productQuery = productQuery.find({
            sizes:{$regex: req.query.sizes, $options: "i"}
        })
    }
    //filter by price range
    if(req.query.price){
        const priceRange = req.query.price.split("-");
        //GTE : greater than or equal 
        //LTE : less than or equal to
        productQuery = productQuery.find({
            price:{$gte: priceRange[0], $lte: priceRange[1]}
        })
    }
    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt (req.query.page) : 1;
    //limit
    const limit = parseInt(req.query.limit) ? parseInt (req.query.limit) : 10;
    //startindex
    const startindex = (page-1) * limit
    //endindex
    const endindex = page * limit
    //total
    const total = await Product.countDocuments() 
    productQuery = productQuery.skip(startindex).limit(limit)
    //pagination result
    const pagination = {}
    if(endindex < total){
        pagination.next = {
            page: page + 1,
            limit,
        }
    }
    if(startindex > 0){
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }

    //await the query
    const products = await productQuery.populate('reviews');
    res.json({
        status :"success",
        total,
        results: products.lenght,
        pagination,
        message: "product fetched successfully",
        products,
    })
})

//@desc Get single product
//@routes Get /api/v1products/:id
//access public

export const getSingleProductCtrl = asyncHandler (async(req, res)=>{
    const product = await Product.findById(req.params.id).populate('reviews');;
    if(!product){
        throw new Error ('product not found')
    }
    res.json({
        status: "success",
        message: "product fetched successfully",
        product,
    });
});


//@desc Get update product
//@routes Get /api/v1products/:id/update
//access private/Admin

export const updateProductCtrl = asyncHandler (async(req, res)=>{
    const{
        name, 
        description, 
        category,
        sizes,
        colors, 
        user,
        price, 
        totalQty,
        brand,
    } = req.body

    //update
    const product = await Product.findByIdAndUpdate(req.params.id,
    {
        name, 
        description, 
        category,
        sizes,
        colors, 
        user,
        price, 
        totalQty,
        brand,
    },
    {
        new: true,
    }
    )
    res.json({
        status: "success",
        message: "product updated successfully",
        product,
    });
});

//@desc delete product
//@routes Get /api/v1products/:id/delete
//access private/Admin

export const deleteProductCtrl = asyncHandler (async(req, res)=>{
    await Product.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "product deleted successfully",
    });
});


