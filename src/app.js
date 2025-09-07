import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Get your backend's origin from env or use current host
    const allowedOrigin = process.env.CORS_ORIGIN || `http://localhost:${process.env.PORT || 3000}`;

    if (origin === allowedOrigin) {
      callback(null, true); // Allow
    } else {
      callback(new Error("Not allowed by CORS")); // Block others
    }
  },
  credentials: true
};

app.use(cors(corsOptions));


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Handle routes like /appointment, /dashboard without .html
app.get("/:page", (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, "public", `${page}.html`);
  res.sendFile(filePath, err => {
    if (err) next(); // If file not found, go to next middleware
  });
});

// Default route for index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import appointmentRouter from './routes/appointment.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/appointments", appointmentRouter)

// http://localhost:8000/api/v1/users/register

export { app }