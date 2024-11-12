//review Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: [true,"Review must belong to a user"],
            ref: "User",
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            required: [true,"Review must belong to a product"],
            ref: "product",
        },
        message:{
            type:String,
            required:[true,"please add a message"],
        },
        rating:{
            type:Number,
            required:[true,"please add a rating between 1 and 5"],
            min:1,
            max:5,
        },
    },
    {
        timestamps: true,
    }
)

const Review = mongoose.model("Review",ReviewSchema);

export default Review;