import express from 'express';
import { aluminiEmailVerifyController, aluminiLoginController, aluminiRegistrationController } from '../controller/aluminiController.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { message } from '../utils/statusMessage.js';
dotenv.config()
const ALUMINI_SECRET = process.env.ALUMINI_SECRET_KEY;

const aluminiRouter = express.Router();

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
    response.render("aluminiHome.ejs",{email:request.payload.email});
})

aluminiRouter.get("/aluminiJobs",authenticateJWT,(request,response)=>{
    response.render("aluminiJobForm.ejs",{email:request.payload.email});
});


export default aluminiRouter;