import "./App.css";
import PostComposer from "./components/PostComposer";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Dynamic Post Composer</h1>
        <p>
          Compose posts for multiple social media platforms with real-time
          validation and draft management.
        </p>
      </header>

      <PostComposer />
    </div>
  );
}

export default App;