import { Router } from "express";
import * as UC from "./user.controller.js";
import * as UV from "./user.validator.js"
import { validation, authentication } from "../../middleware/index.js";
import { allowedExtensions, hostMulter } from "../../middleware/multer.js";

const userRouter = Router();

userRouter.post("/signup", validation(UV.signupSchema), UC.signup);
userRouter.get("/confirmEmail/:token", UC.confirmEmail);
userRouter.post("/login", validation(UV.loginSchema), UC.login);
userRouter.post("/gmailLogin", validation(UV.gmailLoginSchema), UC.gmailLogin);
userRouter.post("/logout", authentication, UC.logout)
userRouter.get("/profile", authentication, UC.getProfile);
userRouter.patch("/updateUser", validation(UV.updateUserSchema), authentication, UC.updateUser);
userRouter.patch("/updatePassword", validation(UV.updatePasswordSchema), authentication, UC.updatePassword);
userRouter.patch("/forgetPassword", validation(UV.forgetPasswordSchema), UC.forgetPassword);
userRouter.patch("/resetPassword", validation(UV.resetPasswordSchema), UC.resetPassword);
userRouter.patch("/changeProfilePicture", authentication, hostMulter({ customExtensions: allowedExtensions.image }).single("image"), validation(UV.changeProfilePictureSchema), UC.changeProfilePicture);

export default userRouter;