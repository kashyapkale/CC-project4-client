import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function LectureView() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`https://4xoppvn7g2.execute-api.us-east-2.amazonaws.com/prod/listLectures`);
        const lecture = response.data.lectures.find(
          l => l.lecture_id === decodeURIComponent(id)
        );
        
        if (!lecture) {
          setError('Lecture not found');
          setLoading(false);
          return;
        }

        if (!lecture.notes || !lecture.notes.includes('https://')) {
          setError('No notes available for this lecture');
          setLoading(false);
          return;
        }

        try {
          const notesResponse = await axios.get(lecture.notes, { responseType: 'text' });
          setNotes(notesResponse.data);
        } catch (error) {
          setError('Error loading notes. The presigned URL may have expired.');
          console.error('Error fetching notes:', error);
        }
      } catch (error) {
        setError('Error fetching lecture data');
        console.error('Error fetching lecture:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [id]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Lectures
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {notes}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default LectureView; 