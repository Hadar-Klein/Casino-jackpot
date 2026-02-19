import type { Express, Request, Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

const PORT = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up and running with TypeScript!");
});

app.listen(PORT, () => {
  console.log(`⚡️ Server running on port ${PORT}`);
});