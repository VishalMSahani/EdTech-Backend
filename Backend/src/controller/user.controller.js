import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from '../models/user.model.js'

const generateAccessTokenAndRefreshToke = async(userId) =>{
    try {
        const userToken = await User.findById(userId)
        const accessToken = userToken.grantAccessToken()
        const refreshToken = userToken.grantRefreshToken()

        userToken.refreshToken= refreshToken

        await userToken.save({validateBeforeSave:false})
        return(accessToken, refreshToken)

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const signUpUser = asyncHandler(async(req, res)=>{

    const {firstName,
        lastName,
        email, 
        password,
        confirmPassword,
        accountType,
        contact } = req.body

    // if (!firstName || !lastName ||  !email || !password || !confirmPassword || !accountType) {
    //     throw new ApiError(400, 'All fields are required')
    // }

    if ([firstName, lastName, password, confirmPassword, accountType, email, contact].some((field)=>field?.trim()==="")) {
        throw new ApiError(400, 'All fields are required')
    }

    if (password !== confirmPassword) {
        throw new ApiError(400,"Password and confirm password must be same")
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        throw new ApiError(400, "User already exists with this email")
    }

    const user = await User.create({
         firstName,
         lastName,
         email,
         password,
         accountType,
         confirmPassword,
         contact,
         avatar:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`

    })

    if (!user) {
        throw new ApiError(400, "Failed to create user please try again!")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "New User created successfully")
    )

})

const loginUser = asyncHandler(async(req, res)=>{

    const { email, password} = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email or password is required")
    }

    const user = await User.findOne({email:email})

    if (!user) {
        throw new ApiError(400, "Email not exist Please create account first")
    }

    const matchPassword = await user.matchPasswords(password)

    if(!matchPassword){
        throw new ApiError(400,"Invalid Password")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToke(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -confirmPassword -refreshToken")

    const option = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken , option)
    .cookie("refreshToken", refreshToken , option)
    .json(
        new ApiResponse(200, 
                        {user:loggedInUser, accessToken, refreshToken},
                        "User Looged in successfully"
    ))

})

const logOutUser = asyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(
        req.userId, {$unset:{refreshToken:1}}, 
        {new:true}
    )

    const option={
        httpOnly:true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(
        new ApiResponse(200, {} , "Looged Out successfully")
    )
})


export {signUpUser,
        loginUser,
        logOutUser
    }