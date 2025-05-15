import React from "react";
import { Container, Typography, Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import BookList from "../components/BookList";

const SearchPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box mt={4} mb={2} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Book Finder
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Search for books by title, author, or keywords
        </Typography>
      </Box>
      <SearchBar />
      <BookList />
    </Container>
  );
};

export default SearchPage;
