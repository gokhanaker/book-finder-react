import React, { useState, useEffect } from "react";
import { getFavourites, removeFavourite } from "../utils/favourites";
import { Book } from "../features/book/bookSlice";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Button,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const StyledGrid = styled(Grid)({
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
  });

const Favourites: React.FC = () => {
  const [favourites, setFavourites] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFavourites(getFavourites());
  }, []);

  const handleRemove = (key: string) => {
    removeFavourite(key);
    setFavourites(getFavourites());
  };

  return (
    <Container>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mt: 4, mb: 2 }}
      >
        Back to Search
      </Button>
      {favourites.length === 0 ? (
        <Typography variant="h5" mt={4} textAlign="center">
          You have no favourite books yet.
        </Typography>
      ) : (
        <>
          <Typography variant="h4" mt={2} mb={2}>
            My Favourite Books
          </Typography>
          <Grid container spacing={2}>
            {favourites.map((book) => (
              <StyledGrid container key={book.key}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : "https://via.placeholder.com/200x300?text=No+Cover"
                    }
                    alt={book.title}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {book.author_name?.join(", ") || "Unknown Author"}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Button
                        size="small"
                        onClick={() => navigate(`/book/${book.key.split("/").pop()}`)}
                      >
                        View Details
                      </Button>
                      <IconButton onClick={() => handleRemove(book.key)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </StyledGrid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Favourites; 