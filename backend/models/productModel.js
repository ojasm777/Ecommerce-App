// This is the first step to create a model
// we create schema first
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    // slug to make your website seo friendly
    slug : {
        type : String,
        required : true
    },
    descreption : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    // Jab bhi model banta hai to saath me uski id bhi create hoti hai,
    // yahi id hum log yaha par pass kara rahe hai
    category : {
        type : mongoose.ObjectId,
        ref : 'Category',
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    photo : {
        data : Buffer,
        contentType : String, // image hai document hai, ye hume batana hai
    },
    shipping : {
        type : Boolean
    }
}, {timestamps : true});


export default mongoose.model('Products',productSchema);