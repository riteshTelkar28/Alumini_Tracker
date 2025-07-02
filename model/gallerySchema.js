import mongoose from "mongoose";
import { url } from "../utils/connection.js";
import moment from "moment";
mongoose.connect(url)

const gallerySchema = mongoose.Schema({
    galleryId:{
        type:String,
        required:true
    },
    eventId:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    uploadDate:{
        type:String,
        default:()=>moment(new Date()).format('dd-mm-yyyy')
    },
    uploadTime:{
        type:String,
        default:()=>moment(new Date()).format('hh:mm:ss')
    },
    status:{
        type:Boolean,
        default:true
    }
    
})

export default mongoose.model('gallerySchema',gallerySchema,'gallery')