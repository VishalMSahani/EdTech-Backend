import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {Course} from '../models/course.model.js';
import {User}  from '../models/user.model.js'
import { Tags } from "../models/tags.model.js";

const createCourse = asyncHandler(async(req, res) =>{

    const {title, description, courseDetails, price, tag, thumbnail} = req.body;

    if (!title || !description || !courseDetails || !price || !tag || !thumbnail) {
        throw new ApiError(401, "All fields are required")
    }

    const instructor = await User.findById(req.user?._id);

    if (!instructor) {
        throw new ApiError(400, "instructor not found")
    }

    const getTag = await Tags.findById(tag)

    if (!getTag) {
        throw new ApiError(400, "tags not found")
    }

    //write code to upload thumbnail for thumbnails

    const newCourse = await Course.create({
        title, 
        description,
        courseDetails,
        price: parseFloat(price),
        instructor : instructor?._id ,
        tags: getTag?._id,
    })

    await User.findByIdAndUpdate(
        {_id:instructor?._id},
        {$push: {'courses': newCourse?._id}},{new:true})

    return res
    .status(200)
    .json(
        new ApiResponse(200, newCourse ,"Course created successfully")
    )

})