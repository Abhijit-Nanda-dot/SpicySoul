import mongoose from "mongoose";

export const connectDB = async () => {
    const url = process.env.MONGODB_URL;
    if (!url) {
        console.warn("MONGODB_URL not set. Skipping DB connection.");
        return;
    }
    try {
        await mongoose.connect(url);
        console.log("Database is connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}

//1fSu9Y4i9S1W4jK5
//mongodb+srv://SpicySoul:1fSu9Y4i9S1W4jK5@cluster0.ir9eivj.mongodb.net/?