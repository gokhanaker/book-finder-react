import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { fetchBooks } from "../features/book/bookSlice";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(fetchBooks(query));
    }
  };

  return (
    <Box
      display="flex"
      gap={2}
      sx={{
        width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
        mx: "auto",
      }}
    >
      <TextField
        size="medium"
        label="Search books..."
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        sx={{ flex: 1 }}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ px: 4 }}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
