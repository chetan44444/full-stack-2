# Centralized State Management with Redux Toolkit — Posts & Platforms

A React application demonstrating centralized, normalized state management
using **Redux Toolkit** and **React-Redux**, with asynchronous data flow
handled via `createAsyncThunk` against a simulated (mock) API.

## Objectives Covered

- Global state management (single Redux store as the source of truth)
- Redux Toolkit for scalable, low-boilerplate state handling
- Normalized state structure using `createEntityAdapter`
- Asynchronous data flows using `createAsyncThunk` + a mock API

## Project Structure

```
redux-toolkit-posts-platforms/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── mockApi.js          # Simulated backend (in-memory + delay)
│   ├── app/
│   │   └── store.js            # configureStore() — combines all slices
│   ├── features/
│   │   ├── posts/
│   │   │   └── postsSlice.js   # Normalized posts slice + CRUD thunks
│   │   └── platforms/
│   │       └── platformsSlice.js # Normalized platforms slice + fetch thunk
│   ├── components/
│   │   ├── PlatformList.js     # Displays platforms (fetched on mount)
│   │   ├── PostForm.js         # Creates a new post (addNewPost thunk)
│   │   ├── PostList.js         # Lists posts (fetchPosts thunk)
│   │   └── PostItem.js         # Edit / delete / change status of one post
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Setup & Run

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`.

> This project was generated as a lightweight Create React App-style setup.
> If `npm start` complains about a missing `react-scripts` cache, run
> `npm install` again — it only needs network access once, to fetch
> dependencies.

## Architecture Notes

### 1. Store configuration (`app/store.js`)
A single store is created with `configureStore`, combining the `posts` and
`platforms` reducers. `configureStore` automatically wires up the Redux
DevTools extension and the `redux-thunk` middleware needed for async thunks.

### 2. Normalized state (`createEntityAdapter`)
Both slices use `createEntityAdapter`, which stores collections as:

```js
{
  ids: ["1", "2", "3"],
  entities: {
    "1": { id: "1", title: "...", ... },
    "2": { id: "2", title: "...", ... }
  }
}
```

This avoids nested arrays of objects, makes lookups by ID O(1) instead of
O(n), and avoids duplicate/stale copies of the same entity — the same
normalization principle used in relational databases.

### 3. Async thunks (`createAsyncThunk`)
Each data operation (`fetchPosts`, `addNewPost`, `editPost`, `removePost`,
`fetchPlatforms`) is a thunk with three auto-dispatched action types:
`pending`, `fulfilled`, and `rejected`. The slice's `extraReducers` handle
each phase to update `status`, `error`, and the normalized entities —
giving you loading spinners and error states for free.

### 4. Mock API (`api/mockApi.js`)
`mockApi.js` simulates a backend with an in-memory array and an artificial
500ms delay, so the async flow (loading → success/error) is visible in the
UI. Swapping this for real `fetch`/`axios` calls to a real backend requires
no changes to the slices or components — only `mockApi.js` changes.

### 5. Components use hooks, not prop drilling
Every component reads what it needs directly via `useSelector` and dispatches
actions via `useDispatch`. No post or platform data is passed down through
props from `App.js` — that's the core benefit Redux provides over lifting
state up manually.

## CRUD Operations Implemented

| Operation | Thunk / Action        | Description                                  |
|-----------|------------------------|----------------------------------------------|
| Create    | `addNewPost`           | Adds a new post via the mock API             |
| Read      | `fetchPosts`, `fetchPlatforms` | Loads posts/platforms into the store  |
| Update    | `editPost`              | Edits title/body, or changes post status     |
| Delete    | `removePost`            | Removes a post                               |

## Possible Extensions

- Replace `mockApi.js` with real HTTP calls (e.g., `fetch` to a REST API or
  Firebase).
- Add a `platforms` CRUD UI (currently read-only in the UI, though the slice
  already supports `platformAdded` / `platformUpdated` / `platformRemoved`).
- Add RTK Query for automatic caching/invalidation instead of manual thunks.
- Add unit tests for reducers and thunks using Jest.
