import mongoose from 'mongoose';
const Schema = mongoose.Schema

const productSchema = new Schema (
    {
        name:{
            type: String,  
            required: true ,
        },
        description:{
            type: String,
            required: true ,
        },
        brand:{
            type: String,
            required: true ,
        },
        category:{
            type: String,
            ref:"Category",  
            required: true ,
        },
        sizes:{
            type: [String],
            enum:["S", "M", "L", "XL", "XXL"],
            required: true ,
        },
        colors:{
            type: [String],
            required: true ,
        },
        user:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
        images: [
            {
                type:String,
                default:"https://via.placeholder.com/150",
            },
        ],
        reviews:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        price:{
            type: Number,
            required: true ,
        },
        totalQty:{
            type: Number,
            required: true ,
        },
        totalSold:{
            type: Number,
            required: true ,
            default:0,
        },
    },
    {
        timestamps: true,
        toJSON:{ virtuals:true }
    }
)

//virtuals 
//qty left
productSchema.virtual('Qtyleft').get(function(){
    const product = this
    return product.totalQty - product.totalSold
})
//Total rating
productSchema.virtual("totalReviews").get(function () {
    const product = this;
    return product?.reviews?.length
});

productSchema.virtual("averageRating").get(function () {
    let ratingsTotal = 0
    const product = this 
    product?.reviews?.forEach((review) => {
        ratingsTotal += review?.rating;

    })
    //calculate average rating
    const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(1)
    return averageRating

});

const product = mongoose.model("product",productSchema);
export default product