import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:3001";

interface Comment {
  id: number;
  postId: number;
  text: string;
}

interface CommentsState {
  comments: Comment[];
}

const initialState: CommentsState = {
  comments: [],
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async () => {
    const response = await fetch("${BASE_URL}/comments");
    const data = await response.json();
    return data;
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Omit<Comment, "id">>) => {
      // Generate a unique id for the new comment
      const newId = state.comments.length + 1;

      // Create a new comment object with the generated id
      const newComment: Comment = {
        id: newId,
        ...action.payload,
      };

      // Push the new comment to the state
      state.comments.push(newComment);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchComments.fulfilled,
      (state, action: PayloadAction<Comment[]>) => {
        state.comments = action.payload;
      }
    );
  },
});

export const { addComment } = commentsSlice.actions;
export const selectComments = (state: { comments: CommentsState }) =>
  state.comments.comments;
export default commentsSlice.reducer;
