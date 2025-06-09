import adminSchema from "../model/adminSchema.js";
import bcyrpt from 'bcrypt'
import { message, status } from "../utils/statusMessage.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;
export const adminLoginController = async(request,response)=>{
    try{
        const {email,password} = request.body;
        const adminObj = await adminSchema.findOne({email});
        const adminPassword = adminObj.password;
        console.log(adminObj)
        // console.log(adminPassword)
        const res = await bcyrpt.compare(password,adminPassword)
        // console.log(res)
        if(res){
            const payload ={
                email:request.body.email,
                role:"admin"
            }
            const expiryTime={
                expiresIn:"1d"
            }
            const token = jwt.sign(payload,ADMIN_SECRET,expiryTime);
            response.cookie("admin_jwt",token,{httpOnly:true,maxAge:24*60*60});
            // response.render("adminHome.ejs")
            console.log("tokenized");
            
            response.redirect("/admin/adminHome")
        }else{
            response.render("adminLogin",{message:message.login_error,status:status.failure});
        }

    }catch(error){
        console.log("error while admin login ",error)
        response.render("adminLogin",{message:message.somethingwentwrong,status:status.failure});

    }
}

export const adminHomeController = async(request,response)=>{
    try{
        response.render("adminHome.ejs",{email:request.payload.email})

    }catch(error){
        console.log("error ",error);
        response.render("adminLogin",{message:message.somethingwentwrong,status:status.failure});
    }

}