# Role-Based Access Control (RBAC) — React Demo

A React application demonstrating **authorization** (as distinct from
authentication): role-based route protection with React Router and
permission-driven conditional UI rendering, backed by a Context API
auth store and a mock login "API".

## Objectives Covered

- Authorization mechanisms in applications (roles vs. permissions)
- RBAC implementation with three roles: **Admin**, **Editor**, **Viewer**
- Protected routes using React Router (`<ProtectedRoute>`)
- Dynamic UI rendering based on permissions (`<Can>`)
- Redirects for unauthenticated (`/login`) and unauthorized (`/unauthorized`) access

## Project Structure

```
rbac-react-app/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   ├── users.js          # Mock user directory + mockLogin() "API"
│   │   └── permissions.js    # Role → permissions map (the RBAC core)
│   ├── context/
│   │   └── AuthContext.js    # Auth state via Context API: user, role, login/logout, can()
│   ├── components/
│   │   ├── ProtectedRoute.js # Route guard: auth + role/permission checks
│   │   ├── Can.js            # Declarative permission gate for UI elements
│   │   └── Navbar.js         # Nav links that appear/disappear by permission
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js      # Any authenticated role
│   │   ├── Posts.js          # Permission-gated CRUD buttons
│   │   ├── AdminUsers.js     # Admin-only route
│   │   ├── AdminSettings.js  # Admin-only route
│   │   ├── Unauthorized.js   # 403 page
│   │   └── NotFound.js       # 404 page
│   ├── App.js                # Route table
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

## Demo Accounts

| Role   | Username | Password    |
|--------|----------|-------------|
| Admin  | alice    | admin123    |
| Editor | bob      | editor123   |
| Viewer | carol    | viewer123   |

The login page also has one-click "fill demo credentials" buttons for each
role.

## How It Works

### 1. Roles and permissions (`data/permissions.js`)
Instead of scattering `if (role === "Admin")` checks throughout the app, all
role → permission mappings live in one file:

```js
ROLE_PERMISSIONS = {
  Admin:  ["dashboard:view", "posts:view", "posts:create", "posts:edit", "posts:delete", "users:view", "users:manage", "settings:manage"],
  Editor: ["dashboard:view", "posts:view", "posts:create", "posts:edit"],
  Viewer: ["dashboard:view", "posts:view"],
};
```

Permissions use a `resource:action` naming convention (e.g. `posts:delete`),
which scales far better than hardcoding role names everywhere — if a new
"Moderator" role needs to delete posts but not manage users, you only edit
this file.

### 2. Auth state (`context/AuthContext.js`)
`AuthProvider` wraps the app and exposes:
- `user`, `role`, `isAuthenticated`
- `login(username, password)` / `logout()`
- `can(permission)`, `canAll([...])`, `canAny([...])`, `hasRole(role | [roles])`

The session (mock token + user) is persisted to `localStorage` so a page
refresh doesn't log the user out — mirroring how a real JWT would be
rehydrated on app load.

> **Note on the mock token:** `mockLogin()` returns a base64-encoded JSON
> blob standing in for a JWT, purely so the shape of "receive token → decode
> → get role" is visible. It is **not** cryptographically signed and must
> never be treated as a real JWT in production — a real backend would issue
> a signed token and the frontend would only trust a role that the server
> verified.

### 3. Route protection (`components/ProtectedRoute.js`)
Wrap any `<Route>`'s element in `<ProtectedRoute>`:

```jsx
<Route
  path="/admin/users"
  element={
    <ProtectedRoute roles={["Admin"]}>
      <AdminUsers />
    </ProtectedRoute>
  }
/>
```

- No `roles`/`permissions` prop → just requires login.
- `roles={[...]}` → requires the user's role to be in that list.
- `permissions={[...]}` → requires the role to carry those permissions
  (`requireAll` defaults to `true`; pass `requireAll={false}` for "any of").

Unauthenticated users are redirected to `/login` (with the original
destination remembered via router state, so login sends them back).
Authenticated-but-unauthorized users are redirected to `/unauthorized`.

### 4. Conditional UI rendering (`components/Can.js`)
For UI elements that should simply not render (rather than route away),
use `<Can>`:

```jsx
<Can permission="posts:delete">
  <button className="danger">Delete</button>
</Can>

<Can role="Admin" fallback={<p>Ask an admin</p>}>
  <AdminWidget />
</Can>
```

This is how the Navbar hides the "Users" and "Settings" links from
non-Admins, and how the Posts page hides Create/Edit/Delete buttons per
role.

## Route Map

| Route              | Access                          |
|---------------------|----------------------------------|
| `/login`            | Public                          |
| `/dashboard`         | Any authenticated user          |
| `/posts`             | Requires `posts:view` permission (all roles) |
| `/admin/users`       | Admin only                      |
| `/admin/settings`    | Admin only                      |
| `/unauthorized`      | Public (403 page)               |
| `*`                  | Public (404 page)               |

## Possible Extensions

- Replace `mockLogin` with a real backend issuing signed JWTs, and verify
  the token server-side on every API request (never trust a client-decoded
  role alone).
- Add refresh-token handling and token expiry checks in `AuthContext`.
- Add a `Moderator` role to see how little code changes (just
  `permissions.js` + route/`Can` usages).
- Combine with the "Posts & Platforms" Redux Toolkit experiment by moving
  `AuthContext` state into a Redux slice instead of Context API.
