import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

// Define more specific types for the API response
interface Author {
  key: string;
  name?: string;  // name might not be included in the response
}

interface AuthorDetails {
  personal_name?: string;
  name: string;
  key: string;
}

interface Description {
  type?: string;
  value: string;
}

interface BookDetails {
  key: string;
  title: string;
  authors?: Array<{ author: { key: string } }>;  // Work response format
  author_name?: string[];  // Search response format
  description?: string | Description;
  publish_date?: string;
  covers?: number[];
  subjects?: string[];
  publishers?: string[];
  works?: Array<{ key: string }>;
}

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

  useEffect(() => {
    const fetchAuthorDetails = async (authorKey: string) => {
      try {
        const response = await axios.get<AuthorDetails>(
          `https://openlibrary.org${authorKey}.json`
        );
        return response.data;
      } catch (error) {
        console.error('Error fetching author details:', error);
        return null;
      }
    };

    const fetchBookDetails = async () => {
      if (!bookId) return;

      try {
        setLoading(true);
        // First try to fetch as a work
        let response = await axios.get<BookDetails>(
          `https://openlibrary.org/works/${bookId}.json`
        ).catch(() => null);

        // If work fetch fails, try as a book
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
          const authorPromises = response.data.authors.map(
            ({ author }) => fetchAuthorDetails(author.key)
          );
          const authorDetails = await Promise.all(authorPromises);
          setAuthors(authorDetails.filter((author): author is AuthorDetails => author !== null));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. The book might not be available.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const getDescription = (
    description: string | Description | undefined
  ): string => {
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
    return (
      <Container>
        <Typography color="error" mt={4}>
          {error || "Book not found"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mt: 4, mb: 2 }}
      >
        Back to Search
      </Button>
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
            <Typography variant="h4" gutterBottom>
              {book.title}
            </Typography>

            {authors.length > 0 && (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                by {authors.map(author => author.name || author.personal_name).join(', ')}
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
