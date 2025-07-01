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
import eventSchema from "../model/eventSchema.js";
import eventConfirmationSchema from "../model/eventConfirmationSchema.js";
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
                }//else{
                //     forumData[i].statusMessage = 'Join Forum'
                // }
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
        const chatData = await forumChatSchema.find({forumId:forumDetails.forumId})
        for(var i=0;i<chatData.length;i++
        ){
            const aluminiObj =  await aluminiSchema.findOne({aluminiId:chatData[i].aluminiId},{username:1});
            chatData[i].aluminiName = aluminiObj.username
        }
        console.log("chat data in join forum controller ",chatData)
        const aluminiObj = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
        const aluminiId = aluminiObj.aluminiId;
        const check = await forumMemberSchema.find({forumId,aluminiId});
        const specificId = await forumMemberSchema.find({forumId});
        const totalMembers = specificId.length;
        if(check.length==0){
            const res = await forumMemberSchema.create({forumMemberId:uuid4(),forumId,aluminiId});
            if(res){
                response.render("aluminiChat.ejs",{forumDetails,totalMembers,chatData,myId:aluminiId}) 
            }else{
                const forumData = await forumSchema.find({status:true});
                response.render("aluminiViewAllForumList.ejs",{forumData,message:"unable to join"});   
            }
        }else{
                response.render("aluminiChat.ejs",{forumDetails,totalMembers,chatData,myId:aluminiId})   
        }

    }catch(error){
        console.log("error while joinin forum ",error);
        response.render("aluminiHome.ejs",{email:request.payload.email,message:message.view_forum_error});

    }
}

export const aluminiForumChatController = async(request,response)=>{
    try{
        const forumDetails = JSON.parse(request.body.forumDetails)
        const aluminiObj = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
        const obj = {
            forumChatId:uuid4(),
            forumId:forumDetails.forumId,
            aluminiId:aluminiObj.aluminiId,
            message:request.body.message
        }
        const res = await forumChatSchema.create(obj);
        const specificId = await forumMemberSchema.find({forumId:forumDetails.forumId});
        const totalMembers = specificId.length;
        if(res){
            const chatData = await forumChatSchema.find({forumId:forumDetails.forumId})
            for(var i=0;i<chatData.length;i++
            ){
            const aluminiObj =  await aluminiSchema.findOne({aluminiId:chatData[i].aluminiId},{username:1});
            chatData[i].aluminiName = aluminiObj.username
            }
            console.log("chat data ",chatData)
            response.render("aluminiChat.ejs",{forumDetails,totalMembers,chatData,myId:aluminiObj.aluminiId})
        }else{
            // response.render("aluminiChat.ejs",{forumDetails,totalMembers,chatData})
            const chatData = await forumChatSchema.find({forumId:forumDetails.forumId})
            for(var i=0;i<chatData.length;i++
        ){
            const aluminiObj =  await aluminiSchema.findOne({aluminiId:chatData[i].aluminiId},{username:1});
            chatData[i].aluminiName = aluminiObj.username
        }
            console.log("chat data ",chatData)
            response.render("aluminiChat.ejs",{forumDetails,totalMembers,chatData,myId:aluminiObj.aluminiId})
        }
    }catch(error){
        console.log("error while chatting ",error)
        response.render("aluminiHome.ejs",{email:request.payload.email,message:""});

    }
}

export const aluminiViewEventController = async(request,response)=>{
    try{
        // console.log("in aluminiViewEventController with email  ",request.payload.email)
        const eventData = await eventSchema.find({status:true});
        const eventConfirmationData = await eventConfirmationSchema.find();
        const aluminiObj = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
        const aluminiId = aluminiObj.aluminiId;
        if(eventConfirmationData.length){
            for(var i=0;i<eventData.length;i++){
                for(var j=0;j<eventConfirmationData.length;j++){
                    if(eventConfirmationData[j].eventId == eventData[i].eventId && eventConfirmationData[j].aluminiId == aluminiId){
                        eventData[j].acceptInvitation = "Invitation Accepted"
                    }
                }
            }
        }
        response.render("aluminiViewEvent",{eventData:eventData,message:""})
    }
    catch(error){
        console.log("error while adding event ",error);
        response.render("aluminiHome.ejs",{email:request.payload.email,message:message.event_not_viewed})
    }
}

export const aluminiAcceptInvitationController = async(request,response)=>{
    try{
        const aluminiObj = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1,username:1})
        const obj = {
            eventConfirmationId:uuid4(),
            eventId:request.body.eventId,
            eventName:request.body.eventName,
            aluminiId:aluminiObj.aluminiId,
            aluminiName:aluminiObj.username      
        }
        // console.log("in aluminiAcceptInvitationController  with username  ",obj.aluminiName)
        const result = await eventConfirmationSchema.create(obj);
        if(result){
            const eventData = await eventSchema.find({status:true});
            const eventConfirmationData = await eventConfirmationSchema.find();
            const aluminiObj = await aluminiSchema.findOne({email:request.payload.email},{aluminiId:1});
            const aluminiId = aluminiObj.aluminiId;
            if(eventConfirmationData.length){
                for(var i=0;i<eventData.length;i++){
                    for(var j=0;j<eventConfirmationData.length;j++){
                        if(eventConfirmationData[j].eventId == eventData[i].eventId && eventConfirmationData[j].aluminiId == aluminiId){
                            eventData[i].acceptInvitation = "Invitation Accepted"
                        }
                    }
                }
            }
            response.render("aluminiViewEvent",{eventData:eventData,message:"invitation accepted"})
        }
    }catch(error){
        console.log("error while accepting event ",error)
        const eventData = await eventSchema.find({status:true});
        response.render("aluminiViewEvent",{eventData:eventData.reverse(),message:"Error while accepting data"})
    }

}