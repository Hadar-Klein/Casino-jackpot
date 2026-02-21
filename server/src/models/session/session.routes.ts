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
  /**
   * @swagger
   * /session/roll:
   *   post:
   *     summary: Roll the slot machine
   *     tags: [Session]
   *     responses:
   *       200:
   *         description: Roll result
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 combination:
   *                   type: array
   *                   items:
   *                     type: string
   *                     enum: [C, L, O, W]
   *                   example: ["C", "C", "C"]
   *                 win:
   *                   type: boolean
   *                   example: true
   *                 credits:
   *                   type: number
   *                   example: 19
   *       400:
   *         description: No session cookie found
   *       500:
   *         description: Server error
   */
  router.post("/roll", controller.roll);

  /**
   * @swagger
   * /session/cashout:
   *   post:
   *     summary: Cash out and close the current session
   *     tags: [Session]
   *     responses:
   *       200:
   *         description: Session closed and credits returned
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 payout:
   *                   type: number
   *                   example: 25
   *       400:
   *         description: No session cookie found
   *       500:
   *         description: Server error
   */
  router.post("/cashout", controller.cashOut);

  return router;
}
