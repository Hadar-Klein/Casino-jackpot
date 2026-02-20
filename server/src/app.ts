import type { Express } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Server is up and running with TypeScript!");
});
