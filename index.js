// server.js or index.js (depending on your entry file name)

import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ["http://localhost:5173"], // Update this to your frontend URL in production
    credentials: true,
  })
)

// Import routes
import authRouter from "./routes/auth.route.js"
import noteRouter from "./routes/note.route.js"

// Use routes
app.use("/api/auth", authRouter)
app.use("/api/note", noteRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

// Listen on the correct port
const PORT = process.env.PORT || 3000
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})
