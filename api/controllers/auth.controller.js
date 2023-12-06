import User from "../model/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";



export const signup = async (req,res,next)=>{
    const {username, email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username, email, password:hashedPassword});
    try{
        await newUser.save();
    res.status(201).json('User created successfully!');
    }catch(err){
        next(err);
    }
}   
export const signin = async (req,res,next)=>{
     const {email, password} = req.body;
     try{
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'User not found!'));
        
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Wrong credentials!'));
 
        // const {password:pass, ...rest} = validUser._doc;
        validUser.password = "********";
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(validUser);
     }catch(err){
        next(err);
     }
} 



export const google = async(req,res,next)=>{
        const {name,email,photoUrl} = req.body;
        try{
            const validUser = await User.findOne({email});
            if(!validUser){
                const hashedPassword = bcryptjs.hashSync(photoUrl,10);
                const newUser = new User({username:name,email,password:hashedPassword,avatar:photoUrl});
                await newUser.save();
                const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
                newUser.password = "********";
                res.cookie('access_token',token,{httpOnly:true}).status(200).json(newUser);
            }else{
                const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
                res.cookie('access_token',token,{httpOnly:true}).status(200).json(validUser);

            }
        }catch(err){
            next(err);
        }
}


export const signout = async (req,res)=>{
    try{
        res.clearCookie('access_token');
        res.status(200).json('Signed out successfully!');
    }catch(err){
        next(errorHandler(401,"Error in signing out"));
    }
}