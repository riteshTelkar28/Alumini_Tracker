import express from 'express';
import { aluminiEmailVerifyController, aluminiRegistrationController } from '../controller/aluminiController.js';

const aluminiRouter = express.Router();

aluminiRouter.get("/aluminiLogin",(request,response)=>{
    response.render("aluminiLogin.ejs",{message:""});
})

aluminiRouter.get("/aluminiRegistration",(request,response)=>{
    response.render("aluminiRegistration.ejs",{message:""})
})

aluminiRouter.post("/aluminiRegistration",aluminiRegistrationController);

aluminiRouter.post("/aluminiVerifyEmail",aluminiEmailVerifyController);



export default aluminiRouter;