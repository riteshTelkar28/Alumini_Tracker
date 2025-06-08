import adminSchema from "../model/adminSchema.js";
import bcyrpt from 'bcrypt'
import { message, status } from "../utils/statusMessage.js";
export const adminLoginController = async(request,response)=>{
    try{
        const {email,password} = request.body;
        const adminObj = await adminSchema.findOne({email});
        const adminPassword = adminObj.password;
        console.log(adminObj)
        console.log(adminPassword)
        const res = await bcyrpt.compare(password,adminPassword)
        console.log(res)
        if(res){
            response.render("home.ejs")
        }else{
            response.render("adminLogin",{message:message.login_error,status:status.failure});
        }

    }catch(error){
        console.log("error while admin login ",error)
        response.render("adminLogin",{message:message.somethingwentwrong,status:status.failure});
    }
}