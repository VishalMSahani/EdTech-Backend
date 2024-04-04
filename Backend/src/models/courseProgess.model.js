import mongoose, { Schema } from 'mongoose'

const courseProgressSchema = new Schema({

    courseId:{
        type: Schema.Types.ObjectId,
        ref:"Course"
    },  

    completeVideo:[{
        type:Schema.Types.ObjectId,
        ref:"SubSection"
    }]

})

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)