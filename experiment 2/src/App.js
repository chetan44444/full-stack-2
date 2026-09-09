import React from "react";
import PlatformList from "./components/PlatformList";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Posts &amp; Platforms — Redux Toolkit Demo</h1>
        <p>
          Centralized state management for posts and platform data using
          Redux Toolkit, normalized entity adapters, and async thunks backed
          by a mock API.
        </p>
      </header>

      <main className="app-main">
        <PlatformList />
        <PostForm />
        <PostList />
      </main>
    </div>
  );
}
