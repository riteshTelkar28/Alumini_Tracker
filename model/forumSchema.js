import moment from "moment";
import mongoose from "mongoose";

const forumSchema = mongoose.Schema({
    forumId:{
        type:String,
        required:true
    },

    aluminiId:{
        type:String,
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    startDate:{
        type:String,
        default : ()=> moment(new Date()).format('DD-MM-YYYY')
    },
    startTime:{
        type:String,
        default :()=> moment(new Date()).format('hh:mm:ss a')
    },
    status:{
        type:Boolean,
        default:true
    },
    
});

export default mongoose.model('forumSchema',forumSchema,'forum')