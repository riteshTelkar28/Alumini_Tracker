import uuid4 from "uuid4";
import mailer from "./mailer.js";
import { message } from "../utils/statusMessage.js";
import {fileURLToPath} from 'url';
import path from "path";
import aluminiSchema from '../model/aluminiSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jobSchema from "../model/jobSchema.js";
import forumSchema from "../model/forumSchema.js";
import forumChatSchema from "../model/forumChatSchema.js";
import forumMemberSchema from "../model/forumMemberSchema.js";
dotenv.config()

const ALUMINI_SECRET = process.env.ALUMINI_SECRET_KEY;
export const aluminiRegistrationController = async(request,response)=>{
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
        request.body.password = await bcrypt.hash(request.body.password,10);
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

export const aluminiLoginController = async(request,response)=>{
    try{
        const {email,password} = request.body;
        const aluminiObject = await aluminiSchema.findOne({email});
        const userPassword = aluminiObject.password;
        const passwordMatch = await bcrypt.compare(password,userPassword);
        // console.log(aluminiObject);
        if(passwordMatch && aluminiObject.status && (aluminiObject.emailVerify == "Verified" || aluminiObject.adminVerify == "Verified")){
            const payload ={
                email:request.body.email,
                role:"user"
            }

            const expiryTime ={
                expiresIn:"1d"
            }

            const token = jwt.sign(payload,ALUMINI_SECRET,expiryTime);
            response.cookie("alumini_jwt",token,{httpOnly:true,maxAge:24*60*60*1000});

            response.redirect("/alumini/aluminiHome");
        }else{
            console.log("error while login ",error);
            response.render("aluminiLogin",{message:message.login_error});
        }

    }catch(error){
        console.log("error while login ",error);
        response.render("aluminiLogin",{message:message.login_error});
    }
}


export const aluminiJobPostingController = async(request,response)=>{
    try{
        request.body.jobId = uuid4();
        const aluminiIdObj = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
        request.body.aluminiId = aluminiIdObj.aluminiId;
        // console.log(request.body)

        const res = await jobSchema.create(request.body);
        if(res){
            response.render("aluminiJobForm.ejs",{email:request.payload.email,message:"job posted successfully"})
        }else{
            response.render("aluminiJobForm.ejs",{email:request.payload.email,message:"unable to post job"});

        }

    }catch(error){
        console.log("error while job posting ",error);
        response.render("aluminiJobForm.ejs",{email:request.payload.email,message:"unable to post job"});

    }
}


export const aluminiAddForumTopicController = async(request,response)=>{
    try{
        // console.log(request.body)
        request.body.forumId = uuid4();
        const aluminiObject = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
        request.body.aluminiId = aluminiObject.aluminiId;

        const res = await forumSchema.create(request.body);
        if(res){
            response.render("aluminiAddForumTopic.ejs",{message:message.forum_success})
        }else{
            response.render("aluminiAddForumTopic.ejs",{message:message.forum_error})
        }

    }catch(error){
        console.log("error while adding forum ",error);
        response.render("aluminiHome.ejs",{email:request.payload.email,message:message.forum_error});
    }

}

export const aluminiViewForumListController = async(request,response)=>{
    try{
        const aluminiObject = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
        const aluminiId = aluminiObject.aluminiId;

        const forumData = await forumSchema.find({aluminiId});
        response.render("aluminiViewForumList.ejs",{forumData});

    }catch(error){
        console.log("error while viewing list ",error)
        response.render("aluminiHome.ejs",{email:request.payload.email,message:message.view_forum_error});
    }
}

export const aluminiViewAllForumListController = async(request,response)=>{
    try{
        const forumData = await forumSchema.find();
        const aluminiObj = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
        const aluminiId = aluminiObj.aluminiId;
        const forumMemberArray =  await forumMemberSchema.find(); 
        for(let i=0;i<forumData.length;i++){
            for(let j=0;j<forumMemberArray.length;j++){
                if(forumMemberArray[j].forumId == forumData[i].forumId && forumMemberArray[j].aluminiId == aluminiId){
                    forumData[i].statusMessage = 'send message'
                }else{
                    forumData[i].statusMessage = 'Join Forum'
                }
            }
        }
        response.render("aluminiViewAllForumList.ejs",{forumData,message:""});

    }catch(error){
        console.log("error while viewing all list of forums ",error);
        response.render("aluminiHome.ejs",{email:request.payload.email,message:message.view_forum_error})
    }
}

export const aluminiJoinForumController = async(request,response)=>{
    try{
        const forumDetails = JSON.parse(request.body.forumDetails);
        const forumId = forumDetails.forumId;
        const aluminiObj = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
        const aluminiId = aluminiObj.aluminiId;
        const check = await forumMemberSchema.find({forumId,aluminiId});
        if(check.length==0){
            const res = await forumMemberSchema.create({forumMemberId:uuid4(),forumId,aluminiId});
            if(res){
                response.render("aluminiChat.ejs",{forumDetails})
            }else{
                const forumData = await forumSchema.find({status:true});
                response.render("aluminiViewAllForumList.ejs",{forumData,message:"unable to join"});   
            }
        }else{
                response.render("aluminiChat.ejs",{forumDetails})   
        }

    }catch(error){
        console.log("error while joinin forum ",error);
        response.render("aluminiHome.ejs",{email:request.payload.email,message:message.view_forum_error});

    }
}

export const aluminiForumChatController = async(request,response)=>{
    try{
        const forumDetails = JSON.parse(request.body.forumDetails)
        forumDetails.message = request.body.message;
        const res = await forumChatSchema.create(forumDetails);
        console.log("chat added successfully")

    }catch(error){
        console.log("error while chatting ",error)
        const forumDetails = JSON.parse(request.body.forumDetails);
        response.render("aluminiChat.ejs",{forumDetails,message:""});
        
    }
}