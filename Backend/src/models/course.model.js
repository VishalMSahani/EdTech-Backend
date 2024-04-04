import mongoose, { Schema } from 'mongoose'

const courseSchema = new Schema({
    
    title:{
        type: String,
        required:true
    },
    
    description:{
        type: String,
        required:true
    },

    instructor:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    courseDetails:{
        type: String,
        required:true
    },

    courseContent:[{
        type:Schema.Types.ObjectId,
        ref:"Section"
    }],

    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],

    price:{
        type: Number,
  	    required:true
    },

    thumbnail:{
        type: String,
    },

    tag:{
        type:Schema.Types.ObjectId,
        ref:"Tag"
    },

    studentEnrolled:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }]

})

export const Course = mongoose.model('Course', courseSchema)