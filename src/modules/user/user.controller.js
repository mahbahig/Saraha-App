import { Router } from "express";
import * as UC from "./user.service.js";
import * as UV from "./user.validator.js"
import { validation, authorization, authentication } from "../../middleware/index.js";
import { userRole } from "../../db/models/user.model.js";

const userRouter = Router();

userRouter.post('/signup', validation(UV.signupSchema), UC.signup);
userRouter.post('/login', validation(UV.loginSchema), UC.login);
userRouter.post('/logout', authentication, UC.logout)
userRouter.get('/profile', authorization(userRole), authentication, UC.getUserProfile);
userRouter.delete('/deleteUser/:id', UC.deleteUser);
userRouter.get('/confirmEmail/:token', UC.confirmEmail);
userRouter.patch('/updatePassword', validation(UV.updatePasswordSchema), authentication, UC.updatePassword)

export default userRouter;