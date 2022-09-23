// Import Model
import User from "../models/User.js"
import { cookieToken } from "../utils/cookieToken.js";

// Making Promise
import bigPromise from "../middlewares/bigPromise.js"

export const signUp = bigPromise(async(req,res,next)=>{

    const {username,email,password,role}=req.body;
    if((!username) & (!email) & (!password)){
        return res.status(400).json({
            success:false,
            message:"All fields are required!"
        })
    }

    console.log(username)

    const existingUser = await User.findOne({email:email})
    if(existingUser){
        return res.status(501).json({
            success:true,
            message:"User Already Exists !",
        })
    }
    const user=await User.create({
        username,
        email,
        password,
        role
    })
    cookieToken(user,res,"Registered Successfully!");
})

export const login = bigPromise(async(req,res,next)=>{
    const {email,upassword}=req.body;
    if(!email & !upassword){
        return res.status(401).json({
            success:false,
            message:"Email and Password are required to login!"
        })
    }
    const foundUser = await User.findOne({email:email})

    // check admin
    if(foundUser.role[0]!="admin"){
        return res.status(501).json({
            success:false,
            message:"You are not an Admin"
        })
    }

    if(!foundUser){
        return res.status(401).json({
            success:false,
            message:"User not found with this email!"
        })
    }
    const isMatch = await foundUser.isValidatedPassword(upassword,foundUser.password)

    if(!isMatch){
        return res.status(401).json({
            success:false,
            message:"Password is incorrect!"
        })
    }

    cookieToken(foundUser,res,"Loggined Successfully!")

})

export const logout = bigPromise(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged Out Successfully!"
    })
})

export const getLoggedInUserDetails=bigPromise(async(req,res,next)=>{
    const user =await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
})



// export const updateUser = bigPromise(async(req,res,next)=>{

// })


