import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import Link from "@mui/material/Link";
import NotFound from "./NotFound";
import {
  addFavourite,
  removeFavourite,
  isFavourite,
} from "../utils/favourites";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Book } from "../features/book/bookSlice";
import { AuthorDetails, BookDetails, BookDetailDescription } from "../types";

const StyledGrid = styled(Grid)({
  display: "flex",
  flexWrap: "wrap",
  gap: "32px",
});

const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [authors, setAuthors] = useState<AuthorDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favourited, setFavourited] = useState(false);

  useEffect(() => {
    const fetchAuthorDetails = async (authorKey: string) => {
      try {
        const response = await axios.get<AuthorDetails>(
          `https://openlibrary.org${authorKey}.json`
        );
        return response.data;
      } catch {
        return null;
      }
    };

    const fetchBookDetails = async () => {
      if (!bookId) return;
      try {
        setLoading(true);
        let response = await axios
          .get<BookDetails>(`https://openlibrary.org/works/${bookId}.json`)
          .catch(() => null);

        if (!response) {
          response = await axios.get<BookDetails>(
            `https://openlibrary.org/books/${bookId}.json`
          );
          if (response.data.works?.[0]?.key) {
            const workKey = response.data.works[0].key;
            const workResponse = await axios.get<BookDetails>(
              `https://openlibrary.org${workKey}.json`
            );
            response.data = {
              ...response.data,
              ...workResponse.data,
            };
          }
        }

        setBook(response.data);

        // Fetch author details
        if (response.data.authors) {
          const authorPromises = response.data.authors.map(({ author }) =>
            fetchAuthorDetails(author.key)
          );
          const authorDetails = await Promise.all(authorPromises);
          setAuthors(
            authorDetails.filter(
              (author): author is AuthorDetails => author !== null
            )
          );
        } else if (response.data.author_name) {
          setAuthors(
            response.data.author_name.map((name, idx) => ({
              name,
              key: `author-${idx}`,
            }))
          );
        } else {
          setAuthors([]);
        }

        setError(null);
      } catch (err) {
        setError(
          "Failed to load book details. The book might not be available."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  useEffect(() => {
    if (book) setFavourited(isFavourite(book.key));
  }, [book]);

  const handleToggleFavourite = () => {
    if (!book) return;
    if (favourited) {
      removeFavourite(book.key);
      setFavourited(false);
    } else {
      addFavourite({
        key: book.key,
        title: book.title,
        author_name: authors.map((a) => a.name || a.personal_name || ""),
        first_publish_year: book.first_publish_year,
        cover_i: book.covers?.[0],
      } as Book);
      setFavourited(true);
    }
  };

  const getDescription = (
    description: string | BookDetailDescription | undefined
  ) => {
    if (!description) return "No description available";
    if (typeof description === "string") return description;
    return description.value || "No description available";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !book) {
    return <NotFound />;
  }

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="outlined"
        >
          Back to Search
        </Button>
        <Button
          variant="outlined"
          startIcon={<FavoriteIcon />}
          onClick={() => navigate("/favourites")}
        >
          Favourites
        </Button>
      </Box>
      <Paper elevation={2} sx={{ p: 4, mt: 2 }}>
        <StyledGrid container>
          {/* Book Cover */}
          <Grid
            component="div"
            sx={{
              width: { xs: "100%", md: "33.333%" },
            }}
          >
            <Box
              component="img"
              src={
                book.covers?.[0]
                  ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
                  : "https://via.placeholder.com/400x600?text=No+Cover"
              }
              alt={book.title}
              sx={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          </Grid>

          {/* Book Details */}
          <Grid
            component="div"
            sx={{
              width: { xs: "100%", md: "calc(66.666% - 32px)" },
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h4" gutterBottom>
                {book.title}
              </Typography>
              <Tooltip
                title={
                  favourited ? "Remove from favourites" : "Add to favourites"
                }
              >
                <IconButton
                  onClick={handleToggleFavourite}
                  color={favourited ? "error" : "default"}
                >
                  {favourited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            {authors.length > 0 && (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                by{" "}
                {authors.map((author, idx) =>
                  author.key.startsWith("/authors/") ? (
                    <span key={author.key}>
                      <Link
                        component={RouterLink}
                        to={`/author/${author.key.replace("/authors/", "")}`}
                        underline="hover"
                      >
                        {author.name}
                      </Link>
                      {idx < authors.length - 1 && ", "}
                    </span>
                  ) : (
                    <span key={author.key}>
                      {author.name}
                      {idx < authors.length - 1 && ", "}
                    </span>
                  )
                )}
              </Typography>
            )}

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {getDescription(book.description)}
              </Typography>
            </Box>

            <Box mt={3}>
              {book.publish_date && (
                <Typography variant="body2" gutterBottom>
                  Published: {book.publish_date}
                </Typography>
              )}

              {book.publishers && book.publishers.length > 0 && (
                <Typography variant="body2" gutterBottom>
                  Publishers: {book.publishers.join(", ")}
                </Typography>
              )}
            </Box>

            {book.subjects && book.subjects.length > 0 && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Subjects
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {book.subjects.slice(0, 10).map((subject, index) => (
                    <Chip
                      key={index}
                      label={subject}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </StyledGrid>
      </Paper>
    </Container>
  );
};

export default BookDetail;
