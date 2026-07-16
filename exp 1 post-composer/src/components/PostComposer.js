import React, { useState } from "react";
import "./PostComposer.css";

const platformData = {
  Twitter: {
    limit: 280,
    icon: "🐦",
    color: "#1DA1F2",
  },
  Facebook: {
    limit: 63206,
    icon: "📘",
    color: "#1877F2",
  },
  Instagram: {
    limit: 2200,
    icon: "📷",
    color: "#E1306C",
  },
  LinkedIn: {
    limit: 3000,
    icon: "💼",
    color: "#0A66C2",
  },
};

function PostComposer() {

  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const limit = platformData[platform].limit;

  const remaining = limit - post.length;

  const exceeded = post.length > limit;

  const progress = Math.min(
    (post.length / limit) * 100,
    100
  );

  const saveDraft = () => {

    if (post.trim() === "") {
      setMessage("⚠ Please write something.");
      return;
    }

    if (exceeded) {
      setMessage(
        `⚠ ${platform} only allows ${limit} characters.`
      );
      return;
    }

    const draft = {
      id: editingId || Date.now(),
      platform,
      text: post,
      time: new Date().toLocaleString(),
    };

    if (editingId) {

      setDrafts(
        drafts.map((d) =>
          d.id === editingId ? draft : d
        )
      );

      setMessage("✏ Draft Updated Successfully");

    } else {

      setDrafts([draft, ...drafts]);

      setMessage("✅ Draft Saved Successfully");
    }

    setEditingId(null);
    setPost("");

  };

  const editDraft = (draft) => {

    setPlatform(draft.platform);
    setPost(draft.text);
    setEditingId(draft.id);
    setMessage("Editing Draft...");

  };

  const deleteDraft = (id) => {

    setDrafts(
      drafts.filter((d) => d.id !== id)
    );

    setMessage("🗑 Draft Deleted");

  };  return (
    <div className="composer">

      <div className="topCard">

        <h2>
          {platformData[platform].icon} Dynamic Post Composer
        </h2>

        <label>Select Platform</label>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {Object.keys(platformData).map((item) => (
            <option key={item}>
              {item}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your post here..."
          value={post}
          onChange={(e) => {
            setPost(e.target.value);
            setMessage("");
          }}
        />

        <div className="counter">

          <span>
            {post.length}/{limit}
          </span>

          <span>
            Remaining : {remaining}
          </span>

        </div>

        <div className="progress">

          <div
            className={`progressFill ${
              exceeded
                ? "danger"
                : post.length > limit * 0.8
                ? "warning"
                : "safe"
            }`}
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

        {message && (
          <p
            className={
              message.includes("⚠")
                ? "warningText"
                : "successText"
            }
          >
            {message}
          </p>
        )}

        {exceeded && (
          <p className="error">
            ⚠ Character limit exceeded by{" "}
            {Math.abs(remaining)} characters.
          </p>
        )}

        <button onClick={saveDraft}>
          {editingId
            ? "Update Draft"
            : "Save Draft"}
        </button>

      </div>

      <div className="draftSection">

        <h2>
          Saved Drafts ({drafts.length})
        </h2>        {drafts.length === 0 ? (
          <div className="emptyDraft">
            <p>No drafts saved yet.</p>
          </div>
        ) : (
          drafts.map((draft) => (
            <div className="draftCard" key={draft.id}>

              <div className="draftHeader">

                <h3>
                  {platformData[draft.platform].icon} {draft.platform}
                </h3>

                <span>{draft.time}</span>

              </div>

              <p className="draftText">
                {draft.text}
              </p>

              <div className="draftButtons">

                <button
                  className="editBtn"
                  onClick={() => editDraft(draft)}
                >
                  ✏ Edit
                </button>

                <button
                  className="deleteBtn"
                  onClick={() => deleteDraft(draft.id)}
                >
                  🗑 Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>

  );
}

export default PostComposer;