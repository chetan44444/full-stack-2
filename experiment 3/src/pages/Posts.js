import React, { useState } from "react";
import Can from "../components/Can";

const INITIAL_POSTS = [
  { id: 1, title: "Welcome post", author: "Alice" },
  { id: 2, title: "Q1 roadmap", author: "Bob" },
  { id: 3, title: "Release notes", author: "Bob" },
];

export default function Posts() {
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const addPost = () => {
    const title = window.prompt("New post title?");
    if (!title) return;
    setPosts((prev) => [
      ...prev,
      { id: Date.now(), title, author: "You" },
    ]);
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Posts</h1>
        {/* Viewers won't see this button; Editors/Admins will */}
        <Can permission="posts:create">
          <button onClick={addPost}>+ New Post</button>
        </Can>
      </div>

      <ul className="post-simple-list">
        {posts.map((post) => (
          <li key={post.id}>
            <div>
              <strong>{post.title}</strong>
              <span className="muted"> — by {post.author}</span>
            </div>
            <div className="post-actions">
              <Can permission="posts:edit">
                <button
                  className="secondary"
                  onClick={() => window.alert(`Editing "${post.title}" (demo only)`)}
                >
                  Edit
                </button>
              </Can>
              {/* Only Admins can delete */}
              <Can permission="posts:delete">
                <button className="danger" onClick={() => deletePost(post.id)}>
                  Delete
                </button>
              </Can>
            </div>
          </li>
        ))}
      </ul>

      <Can
        permission="posts:create"
        fallback={
          <p className="muted">
            Your role (Viewer) has read-only access to posts.
          </p>
        }
      >
        <p className="muted">
          You can create and edit posts. Deleting requires Admin.
        </p>
      </Can>
    </div>
  );
}
