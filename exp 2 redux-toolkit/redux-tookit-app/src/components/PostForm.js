import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/postsSlice";

function PostForm() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Twitter");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim() === "") return;

    dispatch(
      addPost({
        content,
        platform,
      })
    );

    setContent("");
  };

  return (
    <div>
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option>Twitter</option>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>LinkedIn</option>
        </select>

        <br /><br />

        <textarea
          rows="4"
          cols="40"
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Add Post
        </button>
      </form>
    </div>
  );
}

export default PostForm;