import React from "react";
import { useAppSelector } from "../app/hooks";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";

const BookList: React.FC = () => {
  const { books, status, error } = useAppSelector((state) => state.book);

  // Displays a loading spinner if the books are still loading
  if (status === "loading")
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  // Displays an error message if the books fail to load
  if (status === "failed")
    return <Typography color="error">{error}</Typography>;

  // Displays the book list
  return (
    <Grid container spacing={2} mt={2}>
      {books.map((book) => (
        <Card key={book.key}>
          <CardContent>
            <Typography variant="h6">{book.title}</Typography>
            <Typography variant="body2">
              {book.author_name?.join(", ") || "Unknown Author"}
            </Typography>
            <Typography variant="caption">
              {book.first_publish_year || "N/A"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
};

export default BookList;
