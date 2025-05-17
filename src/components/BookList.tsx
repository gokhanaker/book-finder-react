import React from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  CardActionArea,
  Chip,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledGrid = styled(Grid)({
  display: "flex",
  flexWrap: "wrap",
  gap: "24px",
});

const BookList: React.FC = () => {
  const { books, status, error } = useAppSelector((state) => state.book);
  const navigate = useNavigate();

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

  if (status === "succeeded" && books.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="text.secondary">
          No books found for your search.
        </Typography>
      </Box>
    );
  }

  const handleBookClick = (bookKey: string) => {
    // Extract the full ID including OL prefix
    let workId;
    if (bookKey.includes("/works/")) {
      // Format: /works/OL123W
      workId = bookKey.split("/works/")[1]?.split("W")[0] + "W"; // Just get the ID part
    } else if (bookKey.includes("/books/")) {
      // Format: /books/OL123M
      workId = bookKey.split("/books/")[1]?.split("M")[0] + "M"; // Just get the ID part
    }

    if (workId) {
      navigate(`/book/${workId}`);
    }
  };

  // Displays the book list
  return (
    <Box sx={{ mt: 2 }}>
      <StyledGrid container>
        {books.map((book) => (
          <Grid
            component="div"
            key={book.key}
            sx={{
              width: {
                xs: "100%",
                sm: "calc(50% - 12px)",
                md: "calc(33.333% - 16px)",
              },
            }}
          >
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
              onClick={() => handleBookClick(book.key)}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                      : "https://via.placeholder.com/200x300?text=No+Cover"
                  }
                  alt={book.title}
                  sx={{ objectFit: "contain", bgcolor: "grey.100", p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {book.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {book.author_name?.join(", ") || "Unknown Author"}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    {book.first_publish_year && (
                      <Chip
                        label={`Published: ${book.first_publish_year}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </StyledGrid>
    </Box>
  );
};

export default BookList;
