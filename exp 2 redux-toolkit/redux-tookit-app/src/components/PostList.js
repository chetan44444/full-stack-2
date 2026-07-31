import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../redux/postsSlice";

function PostList() {
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>All Posts</h2>

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          >
            <h4>{post.platform}</h4>
            <p>{post.content}</p>

            <button onClick={() => dispatch(deletePost(post.id))}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;