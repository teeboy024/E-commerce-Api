import mongoose from "mongoose";
const Schema = mongoose.Schema;

const colorSchema = new Schema (
    {
        name:{
            type:String,
            required:true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        },
    { timestamps:true }
)

const Color = mongoose.model("color",colorSchema)

export default Color