import express from 'express';
import { aluminiRegistrationController } from '../contoller/aluminiController.js';

const aluminiRouter = express.Router();

aluminiRouter.get("/aluminiLogin",(request,response)=>{
    response.render("aluminiLogin.ejs",{message:""});
})

aluminiRouter.get("/aluminiRegistration",(request,response)=>{
    response.render("aluminiRegistration.ejs",{message:""})
})

aluminiRouter.post("/aluminiRegistration",aluminiRegistrationController);


export default aluminiRouter;