import request from "supertest";
import { app } from "../src/app";

describe("Session API", () => {
  const agent = request.agent(app);

  const createSession = async (a = agent) => {
    const res = await a.post("/session").expect(201);
    expect(res.body).toHaveProperty("credits");
    return res.body.credits;
  };

  // Happy Path

  it("should create a new session", async () => {
    const res = await agent.post("/session");
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("credits");
  });

  it("should get the current session", async () => {
    await createSession(agent);
    const res = await agent.get("/session");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("credits");
    expect(res.body).toHaveProperty("active");
  });

  it("should roll the slot machine", async () => {
    await createSession(agent);
    const res = await agent.post("/session/roll");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("combination");
    expect(res.body).toHaveProperty("win");
    expect(res.body).toHaveProperty("credits");
  });

  it("should cash out", async () => {
    await createSession(agent);
    const res = await agent.post("/session/cashout");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("payout");
  });

  // Edge Cases

  it("should return 400 if session cookie is missing", async () => {
    const res = await request(app).get("/session");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No session cookie found");
  });

  it("should return 404 if session does not exist", async () => {
    const res = await request(app)
      .get("/session")
      .set("Cookie", "sessionId=nonexistent");
    expect(res.status).toBe(404);
  });

  it("should return 400 if rolling without a session", async () => {
    const res = await request(app).post("/session/roll");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No session cookie found");
  });

  it("should return 400 if cashing out without a session", async () => {
    const res = await request(app).post("/session/cashout");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No session cookie found");
  });

  // Credits Update

  it("should update credits after roll", async () => {
    await createSession(agent);
    const sessionBefore = await agent.get("/session");
    const before = sessionBefore.body.credits;
    expect(before).toBeDefined();

    const rollRes = await agent.post("/session/roll");
    expect(rollRes.body.credits).toBeDefined();

    const sessionAfter = await agent.get("/session");
    const after = sessionAfter.body.credits;

    expect(after).not.toBe(before);
    expect(rollRes.body.credits).toBe(after);
  });

  it("should prevent roll after cashout", async () => {
    await createSession(agent);
    await agent.post("/session/cashout").expect(200);

    const res = await agent.post("/session/roll");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No session cookie found");
  });

  it("should clear cookie after cashout", async () => {
    await createSession(agent);
    await agent.post("/session/cashout").expect(200);

    const res = await agent.get("/session");
    expect(res.status).toBe(400);
  });
});
