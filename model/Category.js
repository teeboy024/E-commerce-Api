import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        image:{
            type:String,
            required: true,
        },
        product:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
            },
        ],
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema)

export default Category