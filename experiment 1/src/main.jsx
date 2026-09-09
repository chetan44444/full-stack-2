import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const platforms = {
  Twitter: { limit: 280, color: "#111827" },
  Instagram: { limit: 2200, color: "#e1306c" },
  LinkedIn: { limit: 3000, color: "#0a66c2" },
  Facebook: { limit: 63206, color: "#1877f2" }
};

function App() {

  // =========================
  // A. STATES
  // =========================

  const [selected, setSelected] = useState(["Twitter", "Instagram"]);

  const [content, setContent] = useState("");

  const [media, setMedia] = useState("");

  // Saved posts
  const [savedPosts, setSavedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedPosts")) || [];
    } catch {
      return [];
    }
  });

  // ID of the post currently being edited
  const [editingId, setEditingId] = useState(null);

  // Success/error message
  const [message, setMessage] = useState("");


  // =========================
  // B. SAVE POSTS IN LOCAL STORAGE
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "savedPosts",
      JSON.stringify(savedPosts)
    );
  }, [savedPosts]);


  // =========================
  // C. PLATFORM SELECTION
  // =========================

  const togglePlatform = (name) => {

    setSelected((current) =>
      current.includes(name)
        ? current.filter((p) => p !== name)
        : [...current, name]
    );

  };


  // =========================
  // D. SAVE POST
  // =========================

  const savePost = () => {

    // Don't save empty post
    if (!content.trim()) {
      setMessage("Please write something before saving.");
      return;
    }

    const post = {
      id: editingId || Date.now(),
      content: content,
      media: media,
      platforms: selected,
      updatedAt: new Date().toLocaleString()
    };

    setSavedPosts((current) => {

      // If editing an existing post
      const exists = current.some(
        (p) => p.id === post.id
      );

      if (exists) {

        return current.map((p) =>
          p.id === post.id ? post : p
        );

      }

      // If creating a new post
      return [post, ...current];

    });

    setEditingId(post.id);

    setMessage(
      editingId
        ? "Post updated successfully."
        : "Post saved successfully."
    );

  };


  // =========================
  // E. EDIT SAVED POST
  // =========================

  const editPost = (post) => {

    setContent(post.content);

    setMedia(post.media || "");

    setSelected(post.platforms || []);

    setEditingId(post.id);

    setMessage("Post loaded for editing.");

    // Scroll to composer
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // =========================
  // F. DELETE SAVED POST
  // =========================

  const deletePost = (id) => {

    setSavedPosts((current) =>
      current.filter((p) => p.id !== id)
    );

    // If deleting the post currently being edited
    if (editingId === id) {

      setEditingId(null);

      setContent("");

      setMedia("");

    }

    setMessage("Post deleted.");

  };


  // =========================
  // G. CREATE NEW POST
  // =========================

  const newPost = () => {

    setEditingId(null);

    setContent("");

    setMedia("");

    setSelected([
      "Twitter",
      "Instagram"
    ]);

    setMessage("");

  };


  // =========================
  // H. VALIDATION
  // =========================

  const validation = useMemo(() => {

    return selected.map((name) => {

      const limit = platforms[name].limit;

      const count = content.length;

      return {
        name,
        limit,
        count,
        valid: count <= limit,
        remaining: limit - count
      };

    });

  }, [selected, content]);


  const allValid =
    selected.length > 0 &&
    validation.every((v) => v.valid);


  // =========================
  // I. UI
  // =========================

  return (

    <main className="page">

      <section className="composer">

        {/* ================= HEADER ================= */}

        <header>

          <p className="eyebrow">
            Experiment 1 • React.js
          </p>

          <h1>
            Dynamic Post Composer
          </h1>

          <p className="subtitle">
            Create, validate, save and edit posts
            for multiple social platforms.
          </p>

        </header>


        {/* ================= COMPOSER + VALIDATION ================= */}

        <div className="layout">


          {/* ================= LEFT SIDE ================= */}

          <div className="editor-card">

            <div className="editor-title">

              <div>

                <label className="label">
                  Post Composer
                </label>

                <small>
                  {editingId
                    ? "Editing saved post"
                    : "Create a new post"}
                </small>

              </div>


              {/* New Post button only while editing */}

              {editingId && (

                <button
                  className="secondary"
                  onClick={newPost}
                  type="button"
                >
                  + New Post
                </button>

              )}

            </div>


            {/* ================= PLATFORM SELECTION ================= */}

            <label className="label">
              Select platforms
            </label>

            <div className="platforms">

              {Object.keys(platforms).map((name) => (

                <button
                  key={name}
                  className={`platform ${
                    selected.includes(name)
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    togglePlatform(name)
                  }
                  type="button"
                >

                  <span
                    className="dot"
                    style={{
                      background:
                        platforms[name].color
                    }}
                  />

                  {name}

                </button>

              ))}

            </div>


            {/* ================= POST CONTENT ================= */}

            <label
              className="label"
              htmlFor="post"
            >
              Post content
            </label>

            <textarea
              id="post"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write your post here..."
              rows="10"
            />


            {/* CHARACTER COUNTER */}

            <div className="composer-footer">

              <span>
                {content.length} characters
              </span>

              <span>
                {selected.length} platform
                {selected.length === 1
                  ? ""
                  : "s"} selected
              </span>

            </div>


            {/* ================= MEDIA ================= */}

            <label
              className="label"
              htmlFor="media"
            >
              Media URL (optional)
            </label>

            <input
              id="media"
              value={media}
              onChange={(e) =>
                setMedia(e.target.value)
              }
              placeholder="https://example.com/image.jpg"
            />


            {/* ================= BUTTONS ================= */}

            <div className="actions">

              {/* SAVE / UPDATE */}

              <button
                className="save"
                type="button"
                onClick={savePost}
              >

                {editingId
                  ? "Update Post"
                  : "Save Post"}

              </button>


              {/* PUBLISH */}

              <button
                className="publish"
                type="button"
                disabled={!allValid}
                onClick={() =>
                  alert(
                    "Post is valid and ready to publish!"
                  )
                }
              >

                {allValid
                  ? "Publish Post"
                  : "Fix Validation Errors"}

              </button>

            </div>


            {/* MESSAGE */}

            {message && (

              <div className="message">
                {message}
              </div>

            )}

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <aside className="preview-card">

            <div className="preview-header">

              <h2>
                Validation
              </h2>

              <span
                className={
                  allValid
                    ? "status ok"
                    : "status error"
                }
              >

                {selected.length === 0
                  ? "No platform"
                  : allValid
                  ? "Ready"
                  : "Action needed"}

              </span>

            </div>


            {/* No platform */}

            {selected.length === 0 && (

              <p className="empty">
                Select at least one platform.
              </p>

            )}


            {/* Validation for each platform */}

            {validation.map((item) => (

              <div
                className={`validation ${
                  item.valid
                    ? "valid"
                    : "invalid"
                }`}
                key={item.name}
              >

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <small>
                    Limit:{" "}
                    {item.limit.toLocaleString()}
                    {" "}characters
                  </small>

                </div>


                <div className="counter">

                  {item.count.toLocaleString()}
                  {" / "}
                  {item.limit.toLocaleString()}

                </div>


                <p>

                  {item.valid

                    ? `${item.remaining.toLocaleString()} characters remaining`

                    : `${Math.abs(
                        item.remaining
                      ).toLocaleString()} characters over the limit`

                  }

                </p>

              </div>

            ))}


            {/* ================= LIVE PREVIEW ================= */}

            <div className="preview">

              <h3>
                Live Preview
              </h3>

              <div className="preview-box">

                {content ||
                  "Your post preview will appear here..."}

              </div>

              {media && (

                <small className="media-note">
                  Media attached: {media}
                </small>

              )}

            </div>

          </aside>

        </div>


        {/* ================================================= */}
        {/* SAVED POSTS SECTION */}
        {/* ================================================= */}

        <section className="saved-section">


          <div className="saved-heading">

            <div>

              <h2>
                Saved Posts
              </h2>

              <p>
                Your posts are stored in this browser,
                so you can edit them later.
              </p>

            </div>


            <span className="count-badge">
              {savedPosts.length}
            </span>

          </div>


          {/* No saved posts */}

          {savedPosts.length === 0 ? (

            <div className="no-posts">

              No saved posts yet.
              Write a post above and click{" "}
              <strong>Save Post</strong>.

            </div>

          ) : (


            /* Saved posts */

            <div className="saved-grid">

              {savedPosts.map((post) => (

                <article
                  className="saved-post"
                  key={post.id}
                >


                  {/* Platform + Date */}

                  <div className="saved-post-top">

                    <div className="post-platforms">

                      {post.platforms.map(
                        (platform) => (

                          <span
                            key={platform}
                          >
                            {platform}
                          </span>

                        )
                      )}

                    </div>


                    <small>
                      {post.updatedAt}
                    </small>

                  </div>


                  {/* Saved content */}

                  <p className="saved-content">
                    {post.content}
                  </p>


                  {/* Media */}

                  {post.media && (

                    <p className="saved-media">
                      Media: {post.media}
                    </p>

                  )}


                  {/* Edit/Delete buttons */}

                  <div className="saved-actions">

                    <button
                      type="button"
                      onClick={() =>
                        editPost(post)
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="delete"
                      onClick={() =>
                        deletePost(post.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </section>

    </main>

  );
}


createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <App />

  </React.StrictMode>

);