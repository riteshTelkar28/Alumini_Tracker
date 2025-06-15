import uuid4 from "uuid4";
import mailer from "./mailer.js";
import { message } from "../utils/statusMessage.js";
import {fileURLToPath} from 'url';
import path from "path";
import aluminiSchema from '../model/aluminiSchema.js';

export const aluminiRegistrationController = (request,response)=>{
    try{
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // console.log(__dirname);
        request.body.aluminiId = uuid4();
        const filename = request.files.profile;
        // console.log(request.files);
        // console.log(request.body);
        const newFileName = new Date().getTime()+filename.name;
        request.body.profile = newFileName;
        const pathName = path.join(__dirname.replace("\\controller","")+'/public/document/'+newFileName);
        mailer.mailer(request.body.email,(value)=>{
            if(value){
                console.log("mail sent ");
                filename.mv(pathName,async(error)=>{
                    try{
                        console.log("in try block ");
                        const result = await aluminiSchema.create(request.body);
                        // console.log("result ",result);
                        if(result){
                            response.render("aluminiLogin.ejs",{message:"wait for admin approval"});
                        }else{
                            response.render("aluminiRegistration.ejs",{message:"data not added"});

                        }

                    }catch(error){
                        console.log("error while adding file", error);
                        response.render("aluminiRegistration",{message:message.fileUploadError});
                    }
                })
            }else{
                console.log("error while sending mail ");
                response.render("aluminiRegistration.ejs",{message:message.mail_erroo})
            }
        })
    }
    catch(error){
        console.log("error while adding data",error);
    }
}

export const aluminiEmailVerifyController = async(request,response)=>{
    try{
        const email = request.body.email;
        const change = {
            $set:{
                emailVerify:"Verified"
            }
        }

        const res = await aluminiSchema.updateOne({email:email},change);
        if(res.modifiedCount){
            response.render("aluminiLogin.ejs",{message:"email verified | please login"})
        }else{
            response.render("aluminiLogin.ejs",{message:"not verified"})
        }

    }catch(error){
        console.log("error while verifying email ",error);
        response.render("aluminiLogin.ejs",{message:"not verified"})
    }
}