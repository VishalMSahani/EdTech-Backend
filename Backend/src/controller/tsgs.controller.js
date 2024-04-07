import { Tags } from "../models/tags.model.js";
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'

const createTags = asyncHandler(async(req, res)=>{

    const {name, description} = req.body;

    if (!name || !description) {
        throw new ApiError(400,"Please provide all the required fields")
    }

    let tag =  await Tags.create({
         name:name,
         description:description
    });

    if (!tag) {
        throw new ApiError(400, 'failed in creating tags')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tag , "Tag created successfully")
    )

});

const getAllTags = asyncHandler(async (req,res)=>{

    let tags = await Tags.find({} , {name:true, description:true});

    if (!tags || !tags[0]){
        throw new ApiError(400,"No tags found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,tags , "Tags fetched successfully")
    )

}); 