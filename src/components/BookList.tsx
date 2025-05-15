import React from "react";
import { useAppSelector } from "../app/hooks";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  CardActionArea,
  Chip,
  Grid
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledGrid = styled(Grid)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
});

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
    <Box sx={{ mt: 2 }}>
      <StyledGrid container>
        {books.map((book) => (
          <Grid 
            component="div"
            key={book.key}
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 16px)'
              }
            }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={book.cover_i 
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : 'https://via.placeholder.com/200x300?text=No+Cover'}
                  alt={book.title}
                  sx={{ objectFit: 'contain', bgcolor: 'grey.100', p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
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
