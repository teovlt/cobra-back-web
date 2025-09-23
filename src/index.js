import express from "express";
import cors from "cors";
import { corsOptions } from "./configuration/corsOptions.js";
import { router } from "./routes/router.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api", router);

export default app;
