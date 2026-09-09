import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPost, removePost } from "../features/posts/postsSlice";
import { selectPlatformById } from "../features/platforms/platformsSlice";

const STATUS_OPTIONS = ["draft", "scheduled", "published"];

export default function PostItem({ post }) {
  const dispatch = useDispatch();
  const platform = useSelector((state) =>
    selectPlatformById(state, post.platformId)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  const handleSave = () => {
    dispatch(editPost({ id: post.id, changes: { title, body } }));
    setIsEditing(false);
  };

  const handleStatusChange = (e) => {
    dispatch(editPost({ id: post.id, changes: { status: e.target.value } }));
  };

  const handleDelete = () => {
    dispatch(removePost(post.id));
  };

  return (
    <li className="post-item">
      {isEditing ? (
        <div className="post-edit">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
          />
          <div className="post-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)} className="secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="post-header">
            <h3>{post.title}</h3>
            <span className={`badge badge-${post.status}`}>{post.status}</span>
          </div>
          <p className="post-body">{post.body}</p>
          <div className="post-meta">
            <span>Platform: {platform ? platform.name : "Unknown"}</span>
            <span>Created: {new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="post-actions">
            <select value={post.status} onChange={handleStatusChange}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} className="danger">
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
