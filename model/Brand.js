//brand schema
import moongoose from "mongoose"
const Schema = moongoose.Schema

const BrandSchema = new Schema (
    {
        name:{
            type:String,
            required:"true",
        },
        user:{
            type: moongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        products: [
            {
                type: moongoose.Schema.Types.ObjectId,
                ref: "product",
            },
        ],
    },
    { timestamps:true }
)

const Brand = moongoose.model("Brand",BrandSchema)

export default Brand;