import type { Express } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MemorySessionStore } from "./infrastructure/store/memory.session.store.js";
import { SessionService } from "./models/session/session.service.js";
import { SessionController } from "./models/session/session.controller.js";
import { createSessionRouter } from "./models/session/session.routes.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

export const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const PORT = 5000;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Casino Jackpot API",
      version: "1.0.0",
      description: "REST server for Casino Jackpot game",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./src/models/**/*.ts", "./src/app.ts"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
const strore = new MemorySessionStore();
const service = new SessionService(strore);
const controller = new SessionController(service);

app.use("/session", createSessionRouter(controller));
