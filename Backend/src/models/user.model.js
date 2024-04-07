import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
    confirmPassword:{
        type:String,
        required:true
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
    avatar:{
        type:String,
    },
    courseProgress:[{
        type: Schema.Types.ObjectId, 
        ref:"CourseProgress"
    }],
    refreshToken:{
        type:String
    }

})


// Password Encryption 
userSchema.pre( 'save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password ,10) 
    next()
})

userSchema.methods.matchPasswords=async function(password){
   return await bcrypt.compare(password, this.password)
}
// confirmPassword Encryption 
userSchema.pre( 'save', async function (next) {
    if (!this.isModified('confirmPassword')) return next();

    this.confirmPassword = await bcrypt.hash(this.confirmPassword ,10) 
    next()
})

userSchema.methods.matchConfirmPasswords=async function(confirmPassword){
   return await bcrypt.compare(confirmPassword, this.confirmPassword)
}

// token 
userSchema.methods.grantAccessToken = function(){
    return jwt.sign({
       _id: this._id,
       email : this.email,
       username: this.username,
       fullName:this.fullName
   },
   process.env.ACCESS_TOKEN_SECRET,
   {expiresIn:'1d'} 
   )
}
userSchema.methods.grantRefreshToken = function(){
   return jwt.sign({
       _id: this._id
   },
   process.env.REFRESH_TOKEN_SECRET,
   {expiresIn:'30d'} 
   )
}


export const User = mongoose.model('User', userSchema)