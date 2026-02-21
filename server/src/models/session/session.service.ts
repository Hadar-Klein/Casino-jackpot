import { randomUUID } from "crypto";
import type { Session } from "./session.model.js";
import type { SessionStore } from "./session.store.interfase.js";
import type { SlotMachineService } from "../slot-machine/slot.service.js";

export class SessionService {
  constructor(
    private readonly store: SessionStore,
    private slotMachine: SlotMachineService,
  ) {}

  async createSession(): Promise<Session> {
    const session: Session = {
      id: randomUUID(),
      credits: 10,
      active: true,
      createdAt: new Date(),
    };

    await this.store.create(session);
    return session;
  }

  async getSession(id: string): Promise<Session | null> {
    return this.store.getById(id);
  }

  async deactivateSession(id: string): Promise<void> {
    const session = await this.store.getById(id);
    if (!session) return;

    session.active = false;
    await this.store.update(session);
  }

  async roll(sessionId: string) {
    const session = await this.store.getById(sessionId);
    if (!session || !session.active) {
      throw new Error("Invalid session");
    }
    if (session.credits <= 0) {
      throw new Error("No credits left");
    }
    session.credits -= 1;
    const gameResult = this.slotMachine.rollWithCheat(session.credits);
    session.credits += gameResult.reward;
    await this.store.update(session);
    return {
      combination: gameResult.combination,
      win: gameResult.win,
      credits: session.credits,
    };
  }

  async cashOut(sessionId: string) {
    const session = await this.store.getById(sessionId);
    if (!session || !session.active) {
      throw new Error("Invalid session");
    }
    const payout = session.credits;
    session.active = false;
    await this.store.delete(sessionId);
    return payout;
  }
}
