import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
export const test = (req,res)=>{
    res.json({message:"response from controller part"});
}

export const updateUser = async (req,res,next)=>{
    if(req.user.id !=req.params.id)return next(errorHandler(401,"You can only update your own account"));
    try{
       if(req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password,10);
       }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar,
            }
        },{new:true})

        updatedUser.password = "********";
        res.status(200).json(updatedUser); 
    }catch(error){
        next(error);
    }
}

export const deleteUser = async (req,res,next)=>{
        if(req.params.id!=req.user.id)return next(errorHandler(401,"You can only delete your own account"));
        try{
            await User.findByIdAndDelete(req.params.id);
            res.clearCookie('access_token');
            res.status(200).json("User deleted Successfully");
        }catch(err){
            next(err);
        }
}


