import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  selectAllPosts,
  selectPostsStatus,
  selectPostsError,
} from "../features/posts/postsSlice";
import PostItem from "./PostItem";

export default function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  return (
    <section className="card">
      <h2>Posts</h2>
      {status === "loading" && <p>Loading posts...</p>}
      {status === "failed" && <p className="error">Error: {error}</p>}
      {status === "succeeded" && posts.length === 0 && <p>No posts yet.</p>}
      {status === "succeeded" && posts.length > 0 && (
        <ul className="post-list">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </ul>
      )}
    </section>
  );
}
