import mongoose from "mongoose";
import { url } from "../utils/connection.js";
import moment from "moment";

mongoose.connect(url)

const forumMemberSchema = mongoose.Schema({
    forumMemberId:{
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
    joinDate:{
        type:String,
        default : ()=>moment(new Date()).format("DD-MM-YYYY")
    },
    joinTime:{
        type:String,
        default : ()=>moment(new Date()).format('hh:mm:ss')
    },
    status:{
        type:Boolean,
        default:true
    }

})

export default mongoose.model('forumMemberSchema',forumMemberSchema,'forumMember')