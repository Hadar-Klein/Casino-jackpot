export async function createSession() {
  const res = await fetch("/session", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to create session");
  }
  return res.json();
}

export async function roll() {
  const res = await fetch("/session/roll", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Roll failed");
  }
  return res.json();
}

export async function getSession() {
  const res = await fetch("/session", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get session");
  }
  return res.json();
}

export async function cashOut() {
  const res = await fetch("/session/cashout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Cashout failed");
  }
  return res.json();
}
