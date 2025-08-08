import connectDB from "./db/connectionDB.js";
import { globalErrorHandling } from "./middleware/globalErrorHandling.js";
import messageRouter from "./modules/message/message.controller.js";
import userRouter from "./modules/user/user.controller.js";

const bootstrap = (app, express) => {
    app.use(express.json());

    connectDB();

    app.use('/users', userRouter);
    app.use('/messages', messageRouter)

    app.use(globalErrorHandling)
}

export default bootstrap;