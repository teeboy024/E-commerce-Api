import jwt from "jsonwebtoken"
export const verifytoken = (token) => {
    return jwt.verify(token,process.env.JWT_KEY, (err,decoded ) =>{
        if(err){
            return false
        }else{
            return decoded
        }
    })
}