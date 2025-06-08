import express from 'express';
import dotenv from 'dotenv';
import { initializeAdminData } from './utils/adminUtils.js';
import { status } from './utils/statusMessage.js';
import adminRouter from './router/adminRouter.js';
dotenv.config();

var app = express();
app.use(express.static("public"));
app.set("views","views");
app.set("view engine","ejs");
initializeAdminData();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/",(request,response)=>{
    response.render("home.ejs");
})

app.get("/adminLogin",(request,response)=>{
    response.render("adminLogin.ejs",{message:"",status:status.success});
});

app.post("/adminLogin",adminRouter)

app.listen(process.env.PORT,()=>{
    console.log("server started on port ",process.env.PORT);
})

