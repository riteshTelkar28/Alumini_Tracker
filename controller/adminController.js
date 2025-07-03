import adminSchema from "../model/adminSchema.js";
import bcyrpt from 'bcrypt';
import { message, status } from "../utils/statusMessage.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import uuid4 from "uuid4";
import moment from "moment";
import eventSchema from "../model/eventSchema.js";
import aluminiSchema from "../model/aluminiSchema.js";
import jobSchema from "../model/jobSchema.js";
import { DiResponsive } from "react-icons/di";
import forumSchema from "../model/forumSchema.js";
import { request } from "express";
import eventConfirmationSchema from "../model/eventConfirmationSchema.js";
import gallerySchema from "../model/gallerySchema.js";


dotenv.config();

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;
export const adminLoginController = async(request,response)=>{
    try{
        const {email,password} = request.body;
        const adminObj = await adminSchema.findOne({email});
        const adminPassword = adminObj.password;
        // console.log(adminObj)
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
            response.cookie("admin_jwt",token,{httpOnly:true,maxAge:24*60*60*1000});
            // response.render("adminHome.ejs")
            // console.log("tokenized");
            
            response.render("adminHome.ejs",{email:email,message:""})
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
        response.render("adminHome.ejs",{email:request.payload.email,message:""})

    }catch(error){
        console.log("error ",error);
        response.render("adminLogin",{message:message.somethingwentwrong,status:status.failure});
    }

}

export const adminAddEventController = async(request,response)=>{
    try{
        request.body.eventId = uuid4();
        request.body.eventUploadDate = moment(new Date()).format('DD-MM-YYYY');
        request.body.eventUploadTime = moment(new Date()).format('hh-mm-ss A');
        const res = await eventSchema.create(request.body);
        // console.log(res)
        if(res){
            response.render("AdminAddEvent.ejs",{message:message.event_added,status:status.success})
        }else{
            response.render("AdminAddEvent.ejs",{message:message.event_not_added,status:status.failure})
        }
        
    }catch(error){
        console.log("error while adding event ",error);
        response.render("AdminAddEvent.ejs",{message:message.event_issue,status:status.failure})
    }
}

export const adminViewEventController = async(request,response)=>{
    try{
        const eventData = await eventSchema.find({status:true});
        response.render("adminViewEvent",{eventData:eventData.reverse(),message:""})
    }
    catch(error){
        console.log("error while adding event ",error);
        response.render("adminHome.ejs",{email:request.payload.email,message:message.event_not_viewed})
    }
}

export const adminDeleteEventController = async(request,response)=>{
    try{
        const eventId = request.body.eventId;
        const status = {
            $set:{
                status:false
            }
        }
        const res = await eventSchema.updateOne({eventId},status);
        if(res){
            const eventData = await eventSchema.find({status:true});
            response.render("adminViewEvent.ejs",{eventData:eventData.reverse(),message:"deleted successfully"})
        }else{
        response.render("adminViewEvent.ejs",{eventData:eventData.reverse(),message:"error while deleting"})
        }

    }catch(error){
        console.log("error while deleting admin ",error);
        response.render("adminViewEvent.ejs",{eventData:eventData.reverse(),message:"error while deleting"})
    }
}

export const adminUpdateEventController = async(request,response)=>{
    try{
        const eventId = request.body.eventId;
        const eventData = await eventSchema.findOne({eventId});
        // console.log(eventData);
        if(eventData){
            response.render("adminUpdateEvent.ejs",{eventData,message:""})
        }else{
        response.render("adminViewEvent.ejs",{eventData:eventData.reverse(),message:"error while updating event"});
        }
    }catch(error){
        console.log("error while updating event ",error);
        response.render("adminViewEvent.ejs",{eventData:eventData.reverse(),message:"error while updating event"});
    }
}

export const adminEventUpdateController = async(request,response)=>{
    try{
        const status= {
            $set:request.body
            
        }
        
        const res = await eventSchema.updateOne({eventId:request.body.eventId},status);
        // console.log(res);
        if(res.modifiedCount){
        const eventData = await eventSchema.find({status:true});
        response.render("adminViewEvent",{eventData:eventData.reverse(),message:message.event_updated})
        }else{
        const eventData = await eventSchema.find({status:true});
        response.render("adminViewEvent",{eventData:eventData.reverse(),message:message.event_not_updated})
        }
    }catch(error){
        const eventData = await eventSchema.find({status:true});
        response.render("adminViewEvent",{eventData:eventData.reverse(),message:message.event_not_updated})
        console.log("error while updating ",error)
    }
}

export const adminViewAluminiController = async(request,response)=>{
    try{
        const aluminiData = await aluminiSchema.find({status:true});
        response.render("adminviewAluminis.ejs",{aluminiData,message:""});
    }
    catch(error){
        console.log("error while viewing data ",error)
        response.render("adminHome.ejs",{email:request.payload.email,message:message.somethingwentwrong})
    }
}

export const adminUpdateAluminiController = async(request,response)=>{
    try{
        const aluminiId = request.body.aluminiId;
        const change = {
            $set:{
                adminVerify:"Verified"
            }
        }

        const res = await aluminiSchema.updateOne({aluminiId},change);
        if(res.modifiedCount){
            const aluminiData = await aluminiSchema.find({status:true});
            response.render("adminviewAluminis.ejs",{aluminiData,message:""})
        }else{
            const aluminiData = await aluminiSchema.find({status:true});
            response.render("adminviewAluminis.ejs",{aluminiData,message:message.somethingwentwrong})
        }

    }catch(error){
        console.log("error while verifying alumini ",error);
        const aluminiData = await aluminiSchema.find({status:true});
        response.render("adminviewAluminis.ejs",{aluminiData,message:message.somethingwentwrong})

    }
}

export const adminViewJobsController = async(request,response)=>{
    try{
        const jobData = await jobSchema.find({status:true});
        response.render("adminViewJobs.ejs",{jobData,email:request.payload.email,message:""});

    }catch(error){
        response.render("adminHome.ejs",{email:request.payload.email,message:message.somethingwentwrong})
    }
}

export const adminDeleteJobController = async(request,response)=>{
    try{
        const jobId = request.body.jobId;
        const change = {
            status:false
        }
        const res = await jobSchema.updateOne({jobId},change);
        // console.log(res)
        if(res.modifiedCount){
            const jobData = await jobSchema.find({status:true});
            response.render("adminViewJobs.ejs",{jobData,email:request.payload.email,message:message.deleteSuccess});
        }else{
            const jobData = await jobSchema.find({status:true});
            response.render("adminViewJobs.ejs",{jobData,email:request.payload.email,message:message.somethingwentwrong});
        }
    }catch(error){
        console.log("error while deleting ",error);
            const jobData = await jobSchema.find({status:true});
            response.render("adminViewJobs.ejs",{jobData,email:request.payload.email,message:message.deleteError});
    }
}

export const adminViewAllForumListController = async(request,response)=>{
    try{
        const forumData = await forumSchema.find({status:true});
        response.render("adminViewAllForumList.ejs",{forumData,message:""});

    }catch(error){
        console.log("error while viewing all list of forums ",error);
        response.render("adminHome.ejs",{email:request.payload.email,message:message.view_forum_error})
    }
}

export const adminRemoveForumController = async(request,response)=>{
    try{
        const change = {
            $set:{
                status:false
            }
        }

        const res = await forumSchema.updateOne({forumId:request.body.forumId},change);
        if(res.modifiedCount){
            const forumData = await forumSchema.find({status:true});
            response.render("adminViewAllForumList.ejs",{forumData,message:message.remove_forum_success});
        }else{
            const forumData = await forumSchema.find({status:true});
            response.render("adminViewAllForumList.ejs",{forumData,message:message.remove_forum_error});  
        }

    }catch(error){
        console.log("error while removing forum ",error);
        const forumData = await forumSchema.find({status:true});
        response.render("adminViewAllForumList.ejs",{forumData,message:message.remove_forum_error});
    }
}

export const adminViewAluminiStatusController = async(request,response)=>{
    try{
        const eventConfirmationData = await eventConfirmationSchema.find();
        response.render("adminViewAluminiStatus",{eventConfirmationData})

    }catch(error){
        response.render("adminHome.ejs",{email:request.payload.email,message:"error while viewing aluminis"})
    }
}

export const adminUploadImageController = async(request,response)=>{
    try{
        const res = request.files;
        // console.log(res)
        const arrayOfFiles = []
        for(let i=0;i<res.images.length;i++){
            arrayOfFiles.push(res.images[i].filename)
        }

        const obj = {
            galleryId:uuid4(),
            eventId:request.body.eventId,
            images:arrayOfFiles
        }

        const result = await gallerySchema.create(obj);
        if(result){
            const eventData = await eventSchema.find({status:true});
            response.render("adminViewEvent",{eventData:eventData.reverse(),message:"images uploaded"})
        }
    }catch(error){
        console.log("error while uploading images ",error)
        response.render("adminHome.ejs",{email:request.payload.email,message:"error while viewing aluminis"})
    }
}
