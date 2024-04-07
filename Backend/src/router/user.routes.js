import { Router } from "express";
import {loginUser, logOutUser, signUpUser} from '../controller/user.controller.js'
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router()

// User Routes
router.route("/register").post(signUpUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logOutUser)

export default router;