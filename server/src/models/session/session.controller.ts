import type { NextFunction, Request, Response } from "express";
import { SessionService } from "./session.service.js";

export class SessionController {
  constructor(private readonly service: SessionService) {}
  createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await this.service.createSession();
      res.cookie("sessionId", session.id, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.status(201).json({ credits: session.credits });
    } catch (error) {
      next(error);
    }
  };

  getSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId)
        return res.status(400).json({ message: "No session cookie found" });
      const session = await this.service.getSession(sessionId);
      if (!session)
        return res.status(404).json({ message: "Session not found" });
      res.json({ credits: session.credits, active: session.active });
    } catch (error) {
      next(error);
    }
  };

  roll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;

      if (!sessionId)
        return res.status(400).json({ message: "No session cookie found" });

      const result = await this.service.roll(sessionId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  cashOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId)
        return res.status(400).json({ message: "No session cookie found" });

      const payout = await this.service.cashOut(sessionId);
      res.clearCookie("sessionId");
      res.json({ payout });
    } catch (error) {
      next(error);
    }
  };
}
