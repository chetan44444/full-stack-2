import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { mockApi } from "../../api/mockApi";

// createEntityAdapter gives us a normalized shape automatically:
// { ids: [...], entities: { id: {...} } }
const platformsAdapter = createEntityAdapter();

const initialState = platformsAdapter.getInitialState({
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
});

// ---------- Async Thunk ----------
export const fetchPlatforms = createAsyncThunk(
  "platforms/fetchPlatforms",
  async () => {
    const data = await mockApi.fetchPlatforms();
    return data;
  }
);

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    // Synchronous CRUD, exposed in case platforms need local edits too
    platformAdded: platformsAdapter.addOne,
    platformUpdated: platformsAdapter.updateOne,
    platformRemoved: platformsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.status = "succeeded";
        platformsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { platformAdded, platformUpdated, platformRemoved } =
  platformsSlice.actions;

// ---------- Selectors ----------
// getSelectors gives us selectAll, selectById, selectIds, etc. for free
export const {
  selectAll: selectAllPlatforms,
  selectById: selectPlatformById,
  selectIds: selectPlatformIds,
} = platformsAdapter.getSelectors((state) => state.platforms);

export const selectPlatformsStatus = (state) => state.platforms.status;
export const selectPlatformsError = (state) => state.platforms.error;

export default platformsSlice.reducer;
