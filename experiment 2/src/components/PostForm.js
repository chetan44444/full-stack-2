import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, selectPostsMutationStatus } from "../features/posts/postsSlice";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";

export default function PostForm() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const mutationStatus = useSelector(selectPostsMutationStatus);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [platformId, setPlatformId] = useState("");

  const canSubmit =
    title.trim() !== "" && platformId !== "" && mutationStatus !== "loading";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    dispatch(addNewPost({ title, body, platformId }));
    setTitle("");
    setBody("");
    setPlatformId("");
  };

  return (
    <section className="card">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
        />

        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What do you want to share?"
          rows={3}
        />

        <label htmlFor="platform">Platform</label>
        <select
          id="platform"
          value={platformId}
          onChange={(e) => setPlatformId(e.target.value)}
        >
          <option value="">Select a platform</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={!canSubmit}>
          {mutationStatus === "loading" ? "Saving..." : "Add Post"}
        </button>
      </form>
    </section>
  );
}
