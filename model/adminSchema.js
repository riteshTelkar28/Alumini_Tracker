import mongoose from "mongoose";
import { url } from "../utils/connection.js";

mongoose.connect(url);

const adminSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

export default mongoose.model('adminSchema',adminSchema,'admin');