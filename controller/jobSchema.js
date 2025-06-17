import mongoose from 'mongoose';
import { url } from '../utils/connection.js';
import moment from 'moment';

mongoose.connect(url);

const jobSchema = mongoose.Schema({
    jobId:{
        type:String,
        required:true
    },
    aluminiId:{
        type:String,
        required:true
    },
    post:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    vacancy:{
        type:Number,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    bond:{
        type:String,
        required:true
    },
    timings:{
        type:String,
        required:true
    },
    applyFromDate:{
        type:String,
        required:true
    },
    applyTillDate:{
        type:String,
        required:true
    },
    mode:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    postDate:{
        type:String,
        default: ()=> moment(new Date()).format('DD-MM-YYYY')
    },
    postTime:{
        type:String,
        default: ()=> moment(new Date()).format('hh-mm-ss A')
    },
    status:{
        type:Boolean,
        default:true
    } 
});

export default mongoose.model('jobSchema',jobSchema,'jobs');