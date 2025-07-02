import express, { request } from 'express';
import { adminAddEventController, adminDeleteEventController, adminDeleteJobController, adminEventUpdateController, adminHomeController, adminLoginController, adminRemoveForumController, adminUpdateAluminiController, adminUpdateEventController, adminViewAllForumListController, adminViewAluminiController, adminViewEventController, adminViewJobsController,adminViewAluminiStatusController,adminUploadImageController } from '../controller/adminController.js';
import { message, status } from '../utils/statusMessage.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
dotenv.config();
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;
var adminRouter = express.Router();

const authenticateJWT = (request,response,next)=>{
    try{
        const token = request.cookies.admin_jwt;
        // console.log("token ",token);
        
        if(!token){
            response.render("adminLogin.ejs",{message:message.login_issue,status:status.failure})

        }
        jwt.verify(token,ADMIN_SECRET,(error,payload)=>{
            if(error){
                console.log("error in verify ",error)
                response.render("adminLogin.ejs",{message:message.login_issue,status:status.failure})

            }else{
                request.payload = payload;
                next();
            }
        })
        
    }catch(error){
        console.log("error while admin authentication ",error);
        response.render("adminLogin.ejs",{message:message.somethingwentwrong,status:status.failure})
    }
}

const authorizeJWT = (request,response,next)=>{
    try{
        if(request.payload.role=="admin"){
            next();
        }
    }catch(error){
        console.log("error in authorization ",error);
        response.render("adminLogin.ejs",{message:message.somethingwentwrong,status:status.failure})
                
    }

}

adminRouter.post("/adminLogin",adminLoginController);
adminRouter.get("/adminHome",authenticateJWT,authorizeJWT,adminHomeController)

adminRouter.get("/addEvent",authenticateJWT,(request,response)=>{
    response.render("AdminAddEvent.ejs",{message:"",status:""})
})

adminRouter.post("/adminAddEvent",authenticateJWT,adminAddEventController);

adminRouter.get("/viewEvent",authenticateJWT,adminViewEventController)

adminRouter.post("/adminEventDelete",authenticateJWT,adminDeleteEventController);

adminRouter.post("/adminUpdateEvent",authenticateJWT,adminUpdateEventController);

adminRouter.post("/adminEventUpdate",authenticateJWT,adminEventUpdateController);

adminRouter.get("/adminViewAlumini",authenticateJWT,adminViewAluminiController);

adminRouter.post("/adminUpdateAlumini",authenticateJWT,adminUpdateAluminiController);

adminRouter.get("/adminViewJobs",authenticateJWT,adminViewJobsController);

adminRouter.post("/adminDeleteJob",authenticateJWT,adminDeleteJobController);

adminRouter.get("/adminViewAllForumList",authenticateJWT,adminViewAllForumListController);

adminRouter.post("/adminRemoveForum",authenticateJWT,adminRemoveForumController);

adminRouter.get("/viewAluminiStatus",authenticateJWT,adminViewAluminiStatusController);

const storage = multer.diskStorage({
    destination:'./public/images',
    filename:(request,fileObj,callback)=>{
        callback(null,new Date().getTime()+fileObj.originalname)

    }
})

const uploads = multer({storage:storage})

adminRouter.post("/adminUploadImages",authenticateJWT,uploads.fields([{name:'images',maxCount:100}]),adminUploadImageController)

export default adminRouter;