import mongoose from "mongoose"

const connectDB = async () => {
    mongoose
        .connect(process.env.DB_LINK)
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((error) => {
            console.log(`Error connecting to database ${error}`);
        });
}

export default connectDB;