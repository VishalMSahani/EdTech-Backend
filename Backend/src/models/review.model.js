import mongoose, { Schema } from 'mongoose'

const reviewSchema = new Schema({
    
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

    rating:{
        type:Number,
    },

    review:{
        type:String
    }
})

export const Review = mongoose.model('Review', reviewSchema)