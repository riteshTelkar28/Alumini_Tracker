import mongoose from "mongoose";
import { url } from "../utils/connection.js";
import moment from "moment";

mongoose.connect(url)

const eventConfirmationSchema = mongoose.Schema({
    eventConfirmationId:{
        type:String,
        required:true
    },
    eventId:{
        type:String,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    aluminiId:{
        type:String,
        required:true
    },
    aluminiName:{
        type:String,
        required:true
    },
    acceptInvitationOn:{
        type:String,
        default:()=>moment(new Date()).format('DD-MM-YYYY')
    },
    acceptInvitationAt:{
        type:String,
        default:()=>moment(new Date()).format('hh-mm-ss')
    },
    status:{
        type:Boolean,
        default:true
    }
    
    
    
})

export default mongoose.model('eventConfirmationSchema',eventConfirmationSchema,'eventConfirmation')