import { Router } from "express";
import * as MC from "./message.controller.js";
import * as MV from "./message.validator.js";
import { validation, authentication } from "../../middleware/index.js";

const messageRouter = Router();

messageRouter.post("/create", validation(MV.createMessageSchema), MC.createMessage);
messageRouter.get("/", authentication, MC.getAllMessages);

export default messageRouter;