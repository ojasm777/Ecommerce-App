// Here we will create a new Schema

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true,
        trim : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    phone : {
        type : String,
        require : true
    },
    address : {
        // type ko jaan bhuj kar object kar diya because jab lamba hota to string ke bajaye {}
        type : {},
        require : true
    },
    answer : {
        type : String,
        require : true
    },
    role : {
        type : Number,
        default : 0
    }
}, {timestamps : true});

export default mongoose.model("users", userSchema);
