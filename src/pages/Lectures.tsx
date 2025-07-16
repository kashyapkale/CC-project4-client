import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, IconButton, Tooltip, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import NoteIcon from '@mui/icons-material/Note';
import QuizIcon from '@mui/icons-material/Quiz';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lecture } from '../types';
import { ENDPOINTS } from '../api/endpoints';
import Sidebar from './Sidebar';

const Lectures: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async (): Promise<void> => {
    try {
      const response = await axios.get<{ lectures: Lecture[] }>(ENDPOINTS.listLectures);
      setLectures(response.data.lectures);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f4f6f9">
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 4 },
          ml: { sm: `250px` },
          minHeight: '100vh',
          background: '#f4f6f9',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            width: '95vw',
            maxWidth: 1100,
            mx: 'auto',
            background: '#fff',
          }}
        >
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
                    <TableCell align="right"><strong>Quiz</strong></TableCell>
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
                      <TableCell align="right">
                        <Tooltip title="Take Quiz">
                          <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<QuizIcon />}
                            onClick={() => alert(`Take Quiz for ${lecture.title}`)}
                          >
                            Quiz
                          </Button>
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
  );
};

export default Lectures; 