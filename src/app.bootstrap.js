import connectDB from "./db/connectionDB.js";
import { notFound, errorHandling } from "./middleware/globalErrorHandling.js";
import messageRouter from "./modules/message/message.router.js";
import userRouter from "./modules/user/user.router.js";
import cors from "cors";

const bootstrap = (app, express) => {
    app.use(cors({ origin: process.env.CORS_ORIGIN }));

    app.use(express.json());
    app.use(express.static("uploads"));

    connectDB();

    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/messages", messageRouter);

    app.use(notFound);

    app.use(errorHandling);
};

export default bootstrap;