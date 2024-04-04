import mongoose, { Schema } from 'mongoose'
import mailSender from '../utils/mailSender'
const otpSchema = new Schema({

    email:{
        type:String,
        required:[true,'Please provide your email']
    },

    otp:{
        type:String,
        required:[true,'Please enter otp']
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    },

})

const sendVerificationMail = async(email, otp)=>{

    try {
        const maileResponse = await mailSender(email, "Your verification code is:", otp);
        console.log("email sent successfully: ", maileResponse);

    } catch (error) {
        console.log("error while generating otp", error);
    }    
}

otpSchema.pre("save", async function(next){
    await sendVerificationMail(this.email , this.otp);
    next();
})

export const Otp = mongoose.model("Otp", otpSchema)