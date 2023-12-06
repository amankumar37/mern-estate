import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:'https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg',

    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;