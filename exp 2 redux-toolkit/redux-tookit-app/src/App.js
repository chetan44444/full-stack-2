import "./App.css";

import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import Counter from "./components/Counter";

function App() {
  return (
    <div className="App">

      <h1>Redux Toolkit - Post Management System</h1>

      <hr />

      <h2>Counter Operation</h2>
      <Counter />

      <hr />

      <h2>Create New Post</h2>
      <PostForm />

      <hr />

      <h2>Posts Dashboard</h2>
      <PostList />

    </div>
  );
}

export default App;