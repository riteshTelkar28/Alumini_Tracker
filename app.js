import express from 'express';
import dotenv from 'dotenv';
import { initializeAdminData } from './utils/adminUtils.js';
import { status } from './utils/statusMessage.js';
import adminRouter from './router/adminRouter.js';
import cookieParser from 'cookie-parser';
// import expressFileUpload from 'express-fileupload';
import aluminiRouter from './router/aluminiRouter.js';
dotenv.config();

var app = express();
app.use(express.static("public"));
app.set("views","views");
app.set("view engine","ejs");
initializeAdminData();
app.use(express.urlencoded({extended:true}));
// app.use(expressFileUpload());
app.use(express.json());
app.use(cookieParser())

app.use((req,res,next)=>{
    res.setHeader('Cache-Control','no-store','no-cache','must-revalidate','private')
    next()
})

app.get("/",(request,response)=>{
    response.render("home.ejs");
})

app.get("/adminLogin",(request,response)=>{
    response.render("adminLogin.ejs",{message:"",status:status.success});
});

app.post("/adminLogin",adminRouter)
app.use("/admin",adminRouter);
app.use("/alumini",aluminiRouter);

app.listen(process.env.PORT,()=>{
    console.log("server started on port ",process.env.PORT);
})

 