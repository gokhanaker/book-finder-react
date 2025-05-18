import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { AuthorDetails } from "../types";

const AuthorDetail: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<AuthorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const response = await axios.get<AuthorDetails>(
          `https://openlibrary.org/authors/${authorId}.json`
        );
        setAuthor(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load author details.");
      } finally {
        setLoading(false);
      }
    };
    if (authorId) fetchAuthor();
  }, [authorId]);

  const getBio = (bio: AuthorDetails["bio"]) => {
    if (!bio) return "No bio available.";
    if (typeof bio === "string") return bio;
    return bio.value;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !author) {
    return (
      <Container>
        <Typography color="error" mt={4}>
          {error || "Author not found"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mt: 4, mb: 2 }}
      >
        Back
      </Button>
      <Paper elevation={2} sx={{ p: 4, mt: 2 }}>
        <Box textAlign="center">
          {author.photos?.[0] && (
            <Box
              component="img"
              src={`https://covers.openlibrary.org/b/id/${author.photos[0]}-L.jpg`}
              alt={author.name}
              sx={{
                width: 180,
                height: 240,
                objectFit: "cover",
                borderRadius: 2,
                mb: 2,
              }}
            />
          )}
          <Typography variant="h4" gutterBottom>
            {author.name}
          </Typography>
          {author.personal_name && (
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {author.personal_name}
            </Typography>
          )}
          {(author.birth_date || author.death_date) && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {author.birth_date} - {author.death_date}
            </Typography>
          )}
        </Box>
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Bio
          </Typography>
          <Typography variant="body1">{getBio(author.bio)}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthorDetail;
