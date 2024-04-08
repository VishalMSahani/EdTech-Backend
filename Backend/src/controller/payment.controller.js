import instance from "../Config/razorpay";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Course } from "../models/course.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";
import mailSender from "../utils/mailSender";

const capturePayment = asyncHandler(async(req,res)=>{

    const {courseId} = req.body;
    const {userId} = req.user?.id;

    if (!userId) {
        throw new ApiError(400,"user not found")
    }

    const course = await Course.findById(courseId)

    if (!course) {
        throw new ApiError(400,"Course does not exist")
    }

    const isStudentEnrolled = new mongoose.Types.ObjectId(userId)
    
    if (course.studentEnrolled.includes(isStudentEnrolled)) {
        throw new ApiError(402,"Student already enrolled")
    }

    const amount= course.price

    const option = {
        amount: amount*100,
        currency: "INR", // INR for Indian Rupee
        recipt: Math.random(Date.now(new Date())).toString(),
        notes:{
            courseId,
            userId
        }

    }

    const response = await instance.orders.create(option)
    return res
    .status(201)
    .json(
        new ApiResponse(200, 
            {
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                orderId: response?.id,
                currency: response?.currency,
                amount: response?.amount
                        
        }) 
)
})

const verifySignature = asyncHandler(async(req, res)=>{

    const webhookSecret = "1234567890"

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webhookSecret);

    shasum.update(JSON.stringify(req?.body) );

    const digest = shasum.digest("hex");

    if (signature === digest) {
        
        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{
                    studentEnrolled:userId
                }},
                {new:true}
            )

            if (!enrolledCourse) {
                throw new ApiError(400,"Something went wrong or course not found")
            }

            const studentEnrolled = await User.findOneAndUpdate(
                {
                    _id:userId
                },
                {
                    $push:{
                        courses:courseId
                    }
                },
                {new:true}
            )

            if (!studentEnrolled) {
                throw new ApiError(500,"failed to enroll course for students")
            }

            const sendmail = await mailSender(
                studentEnrolled.email,
                "Conformation for your course subscription",
                "Congratulation you successfully enrolled in this course"
            )

            return res
            .status(200)
            .json(
                new ApiResponse(200,{sendmail, enrolledCourse, studentEnrolled},
                    "Signature verified successfully, and course enrolled")
            )
        } catch (error) {
            throw new ApiError(401, "Signature verification failed")
            
        }

    }

})

export { capturePayment, verifySignature}