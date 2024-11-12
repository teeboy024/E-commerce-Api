import mongoose from 'mongoose';
const Schema = mongoose.Schema

const UserSchema = new Schema (
    {
        fullname:{
            type: String,  
            required: true ,
        },
        email:{
            type: String,
            required: true ,
        },
        password:{
            type: String,
            required: true ,
        },
        orders:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "order",
            },
        ],
        wishlists:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "wishlists",
            },
        ],
        isAdmin:{
            type:Boolean,
            default:false,
        },
        hasShippingAddress:{
            type:Boolean,
            default:false,
        },
        shippingAdress:{
            firstName:{
                type:String,
            },
            lastName:{
                type:String,
            },
            address:{
                type:String,
            },
            city:{
                type:String,
            },
            postalcode:{
                type:String,
            },
            state:{
                type:String,
            },
            country:{
                type:String,
            },
            phone:{
                type:String,
            },
        },
    },
    {
        timestamps: true,
    }
);

//compile the schema to model
const User = mongoose.model("User", UserSchema)


export default User