import { Router } from "express";
import * as UC from "./user.service.js";
import * as UV from "./user.validator.js"
import { validation, authorization, authentication } from "../../middleware/index.js";

const userRouter = Router();

userRouter.post('/signup', validation(UV.signupSchema), UC.signup);
userRouter.post('/login', validation(UV.loginSchema), UC.login);
userRouter.post('/logout', authentication, UC.logout)
userRouter.get('/profile', authorization, authentication, UC.getUserProfile);
userRouter.put('/updateUser/:id', UC.updateUser);
userRouter.delete('/deleteUser/:id', UC.deleteUser);
userRouter.get('/confirmEmail/:token', UC.confirmEmail);

export default userRouter;