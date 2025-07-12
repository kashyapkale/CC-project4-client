import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
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
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ChatIcon from '@mui/icons-material/Chat';
import NoteIcon from '@mui/icons-material/Note';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lecture } from '../types';
import { ENDPOINTS } from '../api/endpoints';

const HARDCODED_PASSWORD = 'lecture123';

function Home(): React.JSX.Element {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [openPasswordDialog, setOpenPasswordDialog] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lectureTitle, setLectureTitle] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    void fetchLectures(); // Using void to explicitly ignore the Promise return
  }, []);

  const fetchLectures = async (): Promise<void> => {
    try {
      const response = await axios.get<{ lectures: Lecture[] }>(
        ENDPOINTS.listLectures
      );
      setLectures(response.data.lectures);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    // Only open the password dialog if a file is actually selected
    if (file) {
      setOpenPasswordDialog(true);
    }
  };

  const handlePasswordSubmit = async (): Promise<void> => {
    setError(''); // Clear previous errors
    if (password === HARDCODED_PASSWORD) {
      setOpenPasswordDialog(false);
      if (selectedFile && lectureTitle) {
        try {
          const fileContent = await selectedFile.text();
          await axios.post(
            ENDPOINTS.uploadTranscript(lectureTitle),
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
          void fetchLectures(); // Using void to explicitly ignore the Promise return
        } catch (uploadError) {
          setError('Error uploading file');
          console.error('Error uploading file:', uploadError);
        }
      } else {
        // This case should ideally not be hit if checks are in place before dialog opens,
        // but good for robustness.
        setError('Please select a file and enter a lecture title.');
      }
    } else {
      setError('Invalid password');
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f4f6f9">
      {/* AppBar/Header */}
      <AppBar position="static" sx={{ bgcolor: '#2196f3', boxShadow: 0 }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: '#fff', mr: 2, width: 55, height: 55 }}>
            <img
              src="/Logo.png"
              alt="Logo"
              style={{ width: 52, height: 42, objectFit: 'contain' }}
            />
          </Avatar>
          <Typography variant="h5" fontWeight={700} color="#fff" sx={{ flexGrow: 1, letterSpacing: 1 }}>
            AI Lecture Assistant
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<ChatIcon />} 
            onClick={() => navigate('/chat')} 
            sx={{ fontWeight: 600, bgcolor: '#1976d2', borderRadius: 2, px: 3, boxShadow: 1 }}
          >
            Chat with AI
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box width="100vw" minHeight="calc(100vh - 64px)" px={{ xs: 2, md: 6 }} py={6}>
        <Box
          display="flex"
          gap={4}
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems="flex-start"
          width="100%"
        >
          {/* Upload Section */}
          <Box flex={1} maxWidth={400}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: '#fff' }}>
              <Typography variant="h6" fontWeight={700} color="#1976d2" gutterBottom>
                Upload New Lecture
              </Typography>
              <TextField
                fullWidth
                label="Lecture Title"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                startIcon={<CloudUploadIcon />}
                component="label"
                sx={{ py: 1.5, fontWeight: 600, fontSize: 16, borderRadius: 2 }}
              >
                Upload TXT
                <input type="file" hidden onChange={handleFileSelect} accept=".txt" />
              </Button>
            </Paper>
          </Box>

          {/* Lecture List Section */}
          <Box flex={2}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: '#fff' }}>
              <Typography variant="h6" fontWeight={700} color="#1976d2" gutterBottom>
                Available Lectures
              </Typography>
              {lectures.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                  No lectures available. Upload a transcript to get started!
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Title</strong></TableCell>
                        <TableCell align="right"><strong>Notes</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lectures.map((lecture) => (
                        <TableRow key={lecture.lecture_id} hover sx={{ transition: 'background 0.2s' }}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <NoteIcon color="primary" />
                              <Typography fontWeight={500}>{lecture.title}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Notes">
                              <IconButton color="primary" onClick={() => navigate(`/lecture/${lecture.lecture_id}`)}>
                                <ChatIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => { 
        setOpenPasswordDialog(false); 
        setError(''); // Clear error on dialog close
        setPassword(''); // Clear password on dialog close
      }}>
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
          <Button onClick={() => { 
            setOpenPasswordDialog(false); 
            setError(''); 
            setPassword(''); 
          }}>
            Cancel
          </Button>
          <Button onClick={handlePasswordSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Home;