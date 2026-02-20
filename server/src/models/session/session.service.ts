import { randomUUID } from "crypto";
import type { Session } from "./session.model.js";
import type { SessionStore } from "./session.store.interfase.js";

export class SessionService {
  constructor(private readonly store: SessionStore) {}

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
}