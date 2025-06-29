import mongoose from "mongoose";
import { url } from "../utils/connection.js";

mongoose.connect(url);

const eventSchema = mongoose.Schema(
    {
        eventId:{
            type:String,
            required:true
        },

        eventName:{
            type:String,
            required:true
        },

        eventStartDate:{
            type:String,
            required:true
        },

        eventEndDate:{
            type:String,
            required:true
        },

        eventStartTime:{
            type:String,
            required:true
        },

        eventEndTime:{
            type:String,
            required:true
        },

        location:{
            type:String,
            required:true
        },

        description:{
            type:String,
            required:true
        },

        eventType:{
            type:String,
            required:true
        },

        criteria:{
            type:String,
            required:true
        },

        modeOfApply:{
            type:String,
            required:true
        },

        startDate:{
            type:String,
            required:true
        },

        endDate:{
            type:String,
            required:true
        },

        eventUploadDate:{
            type:String,
            required:true
        },
        eventUploadTime:{
            type:String,
            required:true
        },
        acceptInvitation:{
            type:String,
            default:'Accept Invitation'
        },
        status:{
            type:Boolean,
            default:true
        }
    }
)

export default mongoose.model('eventSchema',eventSchema,'event')