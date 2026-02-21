import type { Session } from "./session.model.ts";


export interface SessionStore {
 create(session: Session): Promise<void>;
  getById(id: string): Promise<Session | null>;
  update(session: Session): Promise<void>;
  delete(id: string): Promise<void>;
}   