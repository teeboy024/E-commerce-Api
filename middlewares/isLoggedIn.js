import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifytoken } from "../utils/verifyToken.js";

export const isLoggedIn = (req , res ,next) =>{
    //get token from header
    const token = getTokenFromHeader(req);
    //verify the token
    const decodedUser = verifytoken(token);
    if(!decodedUser){
        throw new Error('invalid/Expired token ,please login again')
    }else{
         //save the user into req obj
        req.userAuthId = decodedUser?.id
        next()
    }

}