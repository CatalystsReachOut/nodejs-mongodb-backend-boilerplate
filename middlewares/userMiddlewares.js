import User from "../models/User.js";
import bigPromise from "./bigPromise.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export const isLoggedIn=bigPromise(async(req,res,next)=>{
    const token=req.cookies.token||req.header("Authorization").replace("Bearer ","") || req.cookies.token
    // console.log(token)
    if(!token){
        return res.status(403).json({
            success:"false",
            message:"Login First to access this page"
        }) 
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET)

    req.user=await User.findOne({_id:decode.id})
    return next()

})

export const customRole=(...roles)=>{
    return(req,res,next)=>{
        console.log(req.user.role[0])
        if (!(req.user.role[0]==="admin")){
            return res.status(403).json({
                success:false,
                message:"you're not allowed for this resource."
            })
        }
        next()
    }
}