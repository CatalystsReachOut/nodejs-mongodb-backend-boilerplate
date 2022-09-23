import express from "express"
const router = express.Router()

import { isLoggedIn } from "../middlewares/userMiddlewares.js"
import { customRole } from "../middlewares/userMiddlewares.js"

// import controllers
import {signUp,login,logout,getLoggedInUserDetails} from "../controllers/userController.js"

router.route("/signup").post(signUp)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/adminDashboard").get(isLoggedIn,customRole("admin"), getLoggedInUserDetails)

// router.route("/retrieveUser/:id").get(retrieveUser)


export default router;


