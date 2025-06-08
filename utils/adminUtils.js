import { message, status } from "./statusMessage.js";
import adminSchema from '../model/adminSchema.js'
import bcrypt from 'bcrypt';

export const initializeAdminData = async(request,response)=>{
    try{
        const result = await adminSchema.find();
        if(result.length==0){
            console.log("admin data goiing to insert")
            const adminObj = {
                email:"admin@gmail.com",
                password: await bcrypt.hash("12345",10)
            }
            await adminSchema.create(adminObj);
            console.log("successfully inserted");

        }

    }catch(error){
        console.log("error in admin login");
        response.render("adminLogin",{message:message.adminLoginError,status:status.failure})
    }
}

