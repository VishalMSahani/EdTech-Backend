import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({

    firstName:{
        type:String,
        required: [true, 'Please provide your first name'],
        trim: true,
        index: true
    },
    lastName:{
        type:String,
        required: [true, 'Please provide your last name'],
        trim: true,
    },
    email:{
        type:String,
        required: [true, 'Please provide your Email'],
        trim: true,
        lowercase:true,
        unique:true
    },
    password:{
        type: String,
        required:[true,"Password is required"],
        minlength:[8,'Password must be at least 8 characters long']

    },
    contact:{
        type:String,
        required:[true, "Contact number is required"]
    },
    accountType:{
        type:String,
        enum:["Admin", "Student", "Instructor"],
        required:true
    },
    status:{
        type:Boolean,
        default:false
    },
    courses:[{
        type: Schema.Types.ObjectId,
        ref:"Course"
    }],
    additionalDetaile:{
        type: Schema.Types.ObjectId,
        ref:"Profile"
    },
    image:{
        type:String,
        required:true
    },
    courseProgress:[{
        type: Schema.Types.ObjectId, 
        ref:"CourseProgress"
    }]

})

export const User = mongoose.model('User', userSchema)