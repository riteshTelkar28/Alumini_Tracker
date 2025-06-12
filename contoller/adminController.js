import adminSchema from "../model/adminSchema.js";
import bcyrpt from 'bcrypt'
import { message, status } from "../utils/statusMessage.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import uuid4 from "uuid4";
import moment from "moment";
import eventSchema from "../model/eventSchema.js";
import { request } from "express";

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