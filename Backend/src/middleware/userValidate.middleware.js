import { ApiError } from "../utils/apiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const isStudent = asyncHandler(async(req, res, next)=>{
    
    if (req.user.accountType !== "Student") {
        throw new ApiError(400, "User must be a student to login")
    }
    next();
})

const isInstructor = asyncHandler(async(req, res, next)=> {

    if (req.user.accountType !== "Instructor") {
        throw new ApiError(400, "User must be an instructor to login")
    }
    next();
});

const isAdmin = asyncHandler(async(req, res, next)=>{
     
    if (req.user.accountType !== "Admin") {
        throw new ApiError(400, "User must be Admin to login")
    }

    next();

})

export {isAdmin, isInstructor, isStudent}