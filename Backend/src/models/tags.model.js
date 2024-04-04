import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema({

     name: { 
        type: String, 
        required: true,
        trim :true 
    },
     description: { 
        type: String, 
        required: true,
    }, 
    course: { 
        type:Schema.Types.ObjectId,
        ref:"Course"
    } 
})

export const Tag = mongoose.model('Tags', tagSchema)