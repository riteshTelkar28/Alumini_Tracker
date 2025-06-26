import mongoose from "mongoose";
import { url } from "../utils/connection.js";
import moment from "moment";

mongoose.connect(url)

const forumChatSchema = mongoose.Schema({
    forumChatId:{
        type:String,
        required:true
    },
    forumId:{
        type:String,
        required:true
    },
    aluminiId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    sentTime:{
        type:String,
        default : ()=>moment(new Date()).format('hh:mm:ss A')
    },
    sentDate:{
        type:String,
        default : ()=>moment(new Date()).format('DD-MM-YYYY')
    },
    report:{
        type:Boolean,
        default:false
    },
    status:{
        type:Boolean,
        default:true
    }
})

export default mongoose.model('forumChatSchema',forumChatSchema,'forumChat')