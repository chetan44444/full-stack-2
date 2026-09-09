// users.js
// Mock "database" of users. In a real app, credentials would never live in
// the frontend — this is only here to simulate a login endpoint so the RBAC
// flow can be demoed without a real backend.

export const MOCK_USERS = [
  {
    id: "u1",
    username: "alice",
    password: "admin123",
    name: "Alice Kumar",
    role: "Admin",
  },
  {
    id: "u2",
    username: "bob",
    password: "editor123",
    name: "Bob Singh",
    role: "Editor",
  },
  {
    id: "u3",
    username: "carol",
    password: "viewer123",
    name: "Carol Mehta",
    role: "Viewer",
  },
];

// Simulates an authentication API call that would normally return a JWT.
// Here we just fake network latency and issue a mock token string.
export const mockLogin = async (username, password) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    throw new Error("Invalid username or password.");
  }

  // A real backend would sign this; we just base64-encode a fake payload
  // so the shape of the flow (token -> decode -> role) is realistic.
  const fakeToken = btoa(
    JSON.stringify({ sub: user.id, role: user.role, name: user.name })
  );

  return {
    token: fakeToken,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  };
};
