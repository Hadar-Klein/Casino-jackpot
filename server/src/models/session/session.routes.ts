// src/modules/session/session.routes.ts
import express from "express";
import { SessionController } from "./session.controller.js";

export function createSessionRouter(controller: SessionController) {
  const router = express.Router();

  /**
   * @swagger
   * /session:
   *   post:
   *     summary: Create a new session
   *     tags: [Session]
   *     responses:
   *       201:
   *         description: Session created
   */
  router.post("/", controller.createSession);

  /**
   * @swagger
   * /session:
   *   get:
   *     summary: Get current session
   *     tags: [Session]
   *     responses:
   *       200:
   *         description: Session details
   */
  router.get("/", controller.getSession);

  return router;
}
