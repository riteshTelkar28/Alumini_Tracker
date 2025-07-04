import express from 'express';
import { aluminiAddForumTopicController, aluminiEmailVerifyController, aluminiForumChatController, aluminiJobPostingController, aluminiJoinForumController, aluminiLoginController, aluminiRegistrationController, aluminiViewAllForumListController, aluminiViewEventController, aluminiViewForumListController,aluminiAcceptInvitationController,aluminiDeclineEventController,aluminiViewGalleryController } from '../controller/aluminiController.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import expressFileUpload from 'express-fileupload';
import { message } from '../utils/statusMessage.js';
dotenv.config()
const ALUMINI_SECRET = process.env.ALUMINI_SECRET_KEY;

const aluminiRouter = express.Router();
aluminiRouter.use(expressFileUpload())

const authenticateJWT = (request,response,next)=>{
    try{
        const token = request.cookies.alumini_jwt;
        if(!token){
            response.render("aluminiLogin",{message:message.login_issue});
        }
        jwt.verify(token,ALUMINI_SECRET,(error,payload)=>{
            if(error){
                console.log("error while authentication ",error);
                response.render("aluminiLogin",{message:message.login_issue})
            }else{
                request.payload = payload;
                next();
            }
        })

    }catch(error){
        response.render("aluminiLogin",{message:message.login_issue});
    }
}


aluminiRouter.get("/aluminiLogin",(request,response)=>{
    response.render("aluminiLogin.ejs",{message:""});
})

aluminiRouter.get("/aluminiRegistration",(request,response)=>{
    response.render("aluminiRegistration.ejs",{message:""})
})

aluminiRouter.post("/aluminiRegistration",aluminiRegistrationController);

aluminiRouter.post("/aluminiVerifyEmail",aluminiEmailVerifyController);

aluminiRouter.post("/aluminiLogin",aluminiLoginController);

aluminiRouter.get("/aluminiHome",authenticateJWT,(request,response)=>{
    response.render("aluminiHome.ejs",{email:request.payload.email,message:""});
})

aluminiRouter.get("/aluminiJobs",authenticateJWT,(request,response)=>{
    response.render("aluminiJobForm.ejs",{email:request.payload.email,message:""});
});

aluminiRouter.post("/aluminiJobs",authenticateJWT,aluminiJobPostingController);

aluminiRouter.get("/aluminiAddForumTopic",authenticateJWT,(request,response)=>{
    response.render("aluminiAddForumTopic.ejs",{message:""});
});

aluminiRouter.post("/aluminiAddForumTopic",authenticateJWT,aluminiAddForumTopicController);

aluminiRouter.get("/aluminiLogout",(request,response)=>{
    response.clearCookie('alumini_jwt');
    response.render("aluminiLogin.ejs",{message:"logout Successfull"})
})

aluminiRouter.get("/aluminiViewForumList",authenticateJWT,aluminiViewForumListController);

aluminiRouter.get("/aluminiViewAllForumList",authenticateJWT,aluminiViewAllForumListController);

aluminiRouter.post("/aluminiJoinForum",authenticateJWT,aluminiJoinForumController);

aluminiRouter.post("/aluminiForumChat",authenticateJWT,aluminiForumChatController);

aluminiRouter.get("/aluminiViewEvents",authenticateJWT,aluminiViewEventController);

aluminiRouter.post("/aluminiAcceptInvitation",authenticateJWT,aluminiAcceptInvitationController);

aluminiRouter.post("/aluminiDeclineEvent",authenticateJWT,aluminiDeclineEventController)

aluminiRouter.get("/aluminiViewGallery",authenticateJWT,aluminiViewGalleryController)
export default aluminiRouter;
