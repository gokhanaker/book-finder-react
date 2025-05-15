import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

interface BookState {
  books: Book[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BookState = {
  books: [],
  status: "idle",
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (query: string) => {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );
    return response.data.docs.slice(0, 20); // limit to 20 results
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default bookSlice.reducer;
