import type { Session } from "../../models/session/session.model.js";
import type { SessionStore } from "../../models/session/session.store.interfase.js";

export class MemorySessionStore implements SessionStore {
  private sesssion = new Map<string, Session>();

  async create(session: Session): Promise<void> {
    this.sesssion.set(session.id, session);
  }

  async getById(id: string): Promise<Session | null> {
    return this.sesssion.get(id) || null;
  }

  async update(session: Session): Promise<void> {
    this.sesssion.set(session.id, session);
  }

  async delete(id: string): Promise<void> {
    this.sesssion.delete(id);
  }
}
