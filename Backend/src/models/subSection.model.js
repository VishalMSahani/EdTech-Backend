import mongoose, { Schema } from 'mongoose'

const subSectionSchema = Schema({

    title:{
        type:String
    },

    timeDuration:{
        type:Number
    },

    secDescription:{
        type:String
    },

    videoUrl:{
        type:String
    }
})

export const SubSection = mongoose.model("SubSection", subSectionSchema)