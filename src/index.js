import express from "express";
import serverlessExpress from "@vendia/serverless-express";
import "dotenv/config";
import cors from "cors";
import { corsOptions } from "./configuration/corsOptions.js";
import { router } from "./routes/router.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

//Routes
app.use("/api", router);

// Démarrer le serveur localement
app.listen(process.env.PORT, () => {
  console.log("Server listening on port", process.env.PORT, "🚀");
});

// Exporter le handler pour AWS Lambda
export const handler = serverlessExpress({ app });
