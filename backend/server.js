import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Database connection
mongoose.connect(process.env.MONGO_DB_URL)
.then(()=>console.log("Database Connected"))
.catch((err)=>console.log("DB error: ",err));

// Routes
app.use("/api/notes", notesRoutes);


// Server start
const port = 5000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
