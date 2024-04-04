import mongoose, {Schema} from 'mongoose';

const profileSchema = new Schema({
    
    gender:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
    }
})

export const Profile = mongoose.model("Profile", profileSchema)