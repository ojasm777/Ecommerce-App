import mongoose from "mongoose";

// used mongoose.Schema to create a schema
// The first step is to create a model

const categorySchema = new mongoose.Schema({
    name : {
        type : String, // error aayi to required and unique ko delete kar dena
        // required : true,
        // unique : true
    },
    slug : {
        type : String,
        lowercase : true
    }
}, {timestamps : true});
// timestamps stores createdAt updatedAt helps in sorting and all

//                           (Name of collection, name of schema)
export default mongoose.model('Category', categorySchema)