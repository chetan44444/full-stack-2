import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { mockApi } from "../../api/mockApi";

// Normalized shape: { ids: [...], entities: { id: {...} } }
// sortComparer keeps the list ordered newest-first without extra selectors.
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState({
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  mutationStatus: "idle", // tracks add/update/delete in flight, separate from fetch
});

// ---------- Async Thunks (CRUD via mock API) ----------
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  return await mockApi.fetchPosts();
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (newPost, { rejectWithValue }) => {
    try {
      return await mockApi.createPost(newPost);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      return await mockApi.updatePost(id, changes);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removePost = createAsyncThunk(
  "posts/removePost",
  async (id, { rejectWithValue }) => {
    try {
      await mockApi.deletePost(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Local/optimistic synchronous reducers, available for pure client-side use
    postAdded: postsAdapter.addOne,
    postUpdated: postsAdapter.updateOne,
    postRemoved: postsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      // ----- fetchPosts -----
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // ----- addNewPost -----
      .addCase(addNewPost.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload || action.error.message;
      })

      // ----- editPost -----
      .addCase(editPost.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(editPost.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload || action.error.message;
      })

      // ----- removePost -----
      .addCase(removePost.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        postsAdapter.removeOne(state, action.payload);
      })
      .addCase(removePost.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { postAdded, postUpdated, postRemoved } = postsSlice.actions;

// ---------- Selectors ----------
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);

export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;
export const selectPostsMutationStatus = (state) => state.posts.mutationStatus;

// Derived selector: posts filtered by platform (demonstrates cross-slice reads)
export const selectPostsByPlatform = (state, platformId) =>
  selectAllPosts(state).filter((post) => post.platformId === platformId);

export default postsSlice.reducer;
