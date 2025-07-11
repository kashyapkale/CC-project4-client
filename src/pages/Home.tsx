import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LectureRow.css';
import { Lecture } from '../types';

const HARDCODED_PASSWORD = 'lecture123';

function Home(): JSX.Element {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [openPasswordDialog, setOpenPasswordDialog] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lectureTitle, setLectureTitle] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async (): Promise<void> => {
    try {
      const response = await axios.get<{ lectures: Lecture[] }>(
        'https://4xoppvn7g2.execute-api.us-east-2.amazonaws.com/prod/listLectures'
      );
      setLectures(response.data.lectures);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setOpenPasswordDialog(true);
  };

  const handlePasswordSubmit = async (): Promise<void> => {
    if (password === HARDCODED_PASSWORD) {
      setOpenPasswordDialog(false);
      if (selectedFile && lectureTitle) {
        try {
          const fileContent = await selectedFile.text();
          await axios.post(
            `https://b9hgm6nhc2.execute-api.us-east-2.amazonaws.com/prod/uploadTranscript?lectureTitle=${encodeURIComponent(lectureTitle)}`,
            fileContent,
            {
              headers: {
                'Content-Type': 'text/plain',
              },
            }
          );
          setSelectedFile(null);
          setLectureTitle('');
          setPassword('');
          fetchLectures();
        } catch (error) {
          setError('Error uploading file');
          console.error('Error uploading file:', error);
        }
      }
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="container-main">
    
    <Container maxWidth={false} className="container">
      <Typography variant="h3" gutterBottom align="center">
        Lecture AI Assistant
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Lecture Title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CloudUploadIcon />}
            component="label"
          >
            Upload TXT
            <input type="file" hidden onChange={handleFileSelect} accept=".txt" />
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            fullWidth
            component="label"
            onClick={() => navigate('/chat')}
          >
            Chat with AI
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Transcript Name</strong></TableCell>
              <TableCell align="right"><strong>Notes</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lectures.map((lecture) => (
              <TableRow key={lecture.lecture_id}>
                <TableCell>{lecture.title}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/lecture/${lecture.lecture_id}`)}
                  >
                    Note
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </div>
  );
}

export default Home; 