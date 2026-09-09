// mockApi.js
// Simulates a backend using an in-memory dataset and artificial network delay.
// This lets the app demonstrate async thunks (pending / fulfilled / rejected)
// without needing a real server.

let platforms = [
  { id: "p1", name: "Instagram" },
  { id: "p2", name: "Twitter / X" },
  { id: "p3", name: "LinkedIn" },
  { id: "p4", name: "Facebook" },
];

let posts = [
  {
    id: "1",
    title: "Launching our new product",
    body: "Excited to announce the launch of our new product line today!",
    platformId: "p1",
    status: "published",
    createdAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Behind the scenes",
    body: "A quick look at how our team builds features end to end.",
    platformId: "p3",
    status: "draft",
    createdAt: "2025-01-02T09:30:00.000Z",
  },
  {
    id: "3",
    title: "Weekly roundup",
    body: "Here's everything that happened this week in one thread.",
    platformId: "p2",
    status: "scheduled",
    createdAt: "2025-01-03T14:15:00.000Z",
  },
];

const DELAY = 500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

export const mockApi = {
  // ---------- PLATFORMS ----------
  fetchPlatforms: async () => {
    await wait(DELAY);
    return [...platforms];
  },

  // ---------- POSTS ----------
  fetchPosts: async () => {
    await wait(DELAY);
    return [...posts];
  },

  createPost: async (newPost) => {
    await wait(DELAY);
    if (!newPost.title || !newPost.platformId) {
      throw new Error("Title and platformId are required to create a post.");
    }
    const post = {
      id: uid(),
      status: "draft",
      createdAt: new Date().toISOString(),
      ...newPost,
    };
    posts = [post, ...posts];
    return post;
  },

  updatePost: async (id, changes) => {
    await wait(DELAY);
    const existing = posts.find((p) => p.id === id);
    if (!existing) {
      throw new Error(`Post with id "${id}" not found.`);
    }
    const updated = { ...existing, ...changes };
    posts = posts.map((p) => (p.id === id ? updated : p));
    return updated;
  },

  deletePost: async (id) => {
    await wait(DELAY);
    const exists = posts.some((p) => p.id === id);
    if (!exists) {
      throw new Error(`Post with id "${id}" not found.`);
    }
    posts = posts.filter((p) => p.id !== id);
    return id;
  },
};
