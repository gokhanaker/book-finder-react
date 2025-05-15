import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import SearchBar from "../components/SearchBar";
import BookList from "../components/BookList";

const SearchPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box
        component={Paper}
        elevation={0}
        sx={{
          mt: 4,
          mb: 2,
          textAlign: "center",
          py: 4,
          backgroundColor: "transparent",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Book Finder
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            width: { xs: '100%', sm: '80%', md: '60%' },
            mx: 'auto'
          }}
        >
          Search for books by title, author, or keywords
        </Typography>
        <SearchBar />
      </Box>
      <BookList />
    </Container>
  );
};

export default SearchPage;
