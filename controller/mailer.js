import nodemailer from 'nodemailer';
var mailer = (email,callback)=>{
    // a transporter object that is able to send mail 
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'codewithritesh28@gmail.com',
            pass:'lnfo thpj gxia yiyb'
        }
    });

    const mailOption = {
        from:'codewithritesh28@gmail.com',
        to:email,
        subject:"Verfication mail",
        html:`hello ${email} <br> this is a verification mail . Please click here to verify your email
        
        <form action="http://localhost:3000/alumini/aluminiVerifyEmail" method="post">
            <input type="hidden" name="email" value="${email}"></input>
            <button>click here</button>
        </form>

        `
    }

    transporter.sendMail(mailOption,(error,info)=>{
        if(error){
            console.log("error while sending mail ",error);
        }
        else{
            callback(info);
        }
    })
}



export default {mailer:mailer};