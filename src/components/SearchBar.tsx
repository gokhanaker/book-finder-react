// src/components/SearchBar.tsx
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { fetchBooks } from "../features/book/bookSlice";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    if (query.trim()) {
      // Dispatches the fetchBooks action with the query
      dispatch(fetchBooks(query));
    }
  };

  return (
    <Box display="flex" gap={2} mt={4}>
      <TextField
        fullWidth
        label="Search books..."
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
